"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Aluno, alunosApi } from "@/lib/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

function AlunosContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Aluno>>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    observacoes: "",
  });

  const { data: alunos, isLoading } = useQuery({
    queryKey: ["alunos"],
    queryFn: () => alunosApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Aluno>) => alunosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      setIsDialogOpen(false);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dataNascimento: "",
        endereco: "",
        observacoes: "",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Aluno>) =>
      editingId ? alunosApi.update(editingId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        dataNascimento: "",
        endereco: "",
        observacoes: "",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => alunosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setFormData(aluno);
    setEditingId(aluno.id);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
      endereco: "",
      observacoes: "",
    });
    setIsDialogOpen(true);
  };

  const filteredAlunos = alunos?.filter((aluno: Aluno) =>
    aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
    aluno.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
          <p className="text-gray-600">Gerenciar alunos do ateliê</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="h-5 w-5" />
          Novo Aluno
        </button>
      </div>

      {/* Search */}
        <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                CPF
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
            ) : filteredAlunos && filteredAlunos.length > 0 ? (
              filteredAlunos.map((aluno: Aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {aluno.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {aluno.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {aluno.telefone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {aluno.cpf}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(aluno)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(aluno.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhum aluno encontrado
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
            <DialogTitle>
              {editingId ? "Editar Aluno" : "Novo Aluno"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                value={formData.nome || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.telefone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dataNascimento: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={formData.endereco || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                rows={3}
              />
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
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {editingId ? "Atualizar" : "Criar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AlunosPage() {
  return <AlunosContent />;
}
