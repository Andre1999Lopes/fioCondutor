"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { alunosApi, matriculasApi, turmasApi } from "@/lib/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface Matricula {
  id: number;
  alunoId: number;
  turmaId: number;
  dataMatricula: string;
  ativa: boolean;
  alunoNome?: string;
  turmaNome?: string;
}

function MatriculasContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [formData, setFormData] = useState<Partial<Matricula>>({
    alunoId: 0,
    turmaId: 0,
    dataMatricula: new Date().toISOString().split("T")[0],
    ativa: true,
  });

  const { data: matriculas, isLoading } = useQuery({
    queryKey: ["matriculas"],
    queryFn: () => matriculasApi.getAll().then((res) => res.data),
  });

  const { data: turmas } = useQuery({
    queryKey: ["turmas"],
    queryFn: () => turmasApi.getAll().then((res) => res.data),
  });

  const { data: alunos } = useQuery({
    queryKey: ["alunos"],
    queryFn: () => alunosApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Matricula>) => matriculasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matriculas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-resumo"] });
      setIsDialogOpen(false);
      setFormData({
        alunoId: 0,
        turmaId: 0,
        dataMatricula: new Date().toISOString().split("T")[0],
        ativa: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => matriculasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matriculas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-resumo"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleNew = () => {
    setFormData({
      alunoId: 0,
      turmaId: 0,
      dataMatricula: new Date().toISOString().split("T")[0],
      ativa: true,
    });
    setIsDialogOpen(true);
  };

  const filteredMatriculas = matriculas?.filter((mat: Matricula) => {
    const matchSearch =
      (mat.alunoNome?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (mat.turmaNome?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchStatus =
      filterStatus === "todas" ||
      (filterStatus === "ativas" ? mat.ativa : !mat.ativa);
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matrículas</h1>
          <p className="text-gray-600">Gerenciar matrículas de alunos</p>
        </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
          <Plus className="h-5 w-5" />
          Nova Matrícula
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por aluno ou turma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="todas">Todas as Matrículas</option>
          <option value="ativas">Ativas</option>
          <option value="inativas">Inativas</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Aluno
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Turma
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Data de Matrícula
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4">
                  <Skeleton className="h-12" />
                </td>
              </tr>
            ) : filteredMatriculas && filteredMatriculas.length > 0 ? (
              filteredMatriculas.map((mat: Matricula) => (
                <tr key={mat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {mat.alunoNome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {mat.turmaNome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(mat.dataMatricula).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        mat.ativa
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mat.ativa ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteMutation.mutate(mat.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma matrícula encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Matrícula</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aluno
              </label>
              <select
                value={formData.alunoId || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alunoId: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value={0}>Selecione um aluno</option>
                {alunos?.map((aluno: any) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turma
              </label>
              <select
                value={formData.turmaId || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    turmaId: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              >
                <option value={0}>Selecione uma turma</option>
                {turmas?.map((turma: any) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Matrícula
              </label>
              <input
                type="date"
                value={formData.dataMatricula || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dataMatricula: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativa"
                checked={formData.ativa || false}
                onChange={(e) =>
                  setFormData({ ...formData, ativa: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="ativa" className="text-sm font-medium text-gray-700">
                Matrícula Ativa
              </label>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                Matricular
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MatriculasPage() {
  return <MatriculasContent />;
}
