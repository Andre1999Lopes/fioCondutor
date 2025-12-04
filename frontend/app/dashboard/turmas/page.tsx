"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { turmasApi } from "@/lib/api/api";
import { toast } from "@/lib/hooks/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";

interface Turma {
  id: number;
  nome: string;
  descricao: string;
  horario: string;
  diasSemana: string;
  instrutorId?: number;
  capacidadeMaxima: number;
  ativa: boolean;
}

function TurmasContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Turma>>({
    nome: "",
    descricao: "",
    horario: "",
    diasSemana: "",
    capacidadeMaxima: 20,
    ativa: true,
  });

  const { data: turmas, isLoading } = useQuery({
    queryKey: ["turmas"],
    queryFn: () => turmasApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Turma>) => turmasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      setIsDialogOpen(false);
      setFormData({
        nome: "",
        descricao: "",
        horario: "",
        diasSemana: "",
        capacidadeMaxima: 20,
        ativa: true,
      });
      toast.success("Turma criada com sucesso");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Erro ao criar turma";
      toast.error(String(msg));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Turma>) =>
      editingId ? turmasApi.update(editingId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({
        nome: "",
        descricao: "",
        horario: "",
        diasSemana: "",
        capacidadeMaxima: 20,
        ativa: true,
      });
      toast.success("Turma atualizada");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Erro ao atualizar turma";
      toast.error(String(msg));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => turmasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turmas"] });
      toast.success("Turma excluída");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Erro ao excluir turma";
      toast.error(String(msg));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validação simples para evitar erro "todos os campos são obrigatórios"
    if (!formData.nome || !formData.horario || !formData.diasSemana || !formData.capacidadeMaxima) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (turma: Turma) => {
    setFormData(turma);
    setEditingId(turma.id);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      nome: "",
      descricao: "",
      horario: "",
      diasSemana: "",
      capacidadeMaxima: 20,
      ativa: true,
    });
    setIsDialogOpen(true);
  };

  const filteredTurmas = turmas?.filter((turma: any) =>
    turma.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-600">Gerenciar turmas do ateliê</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="h-5 w-5" />
          Nova Turma
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Grid de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </>
        ) : filteredTurmas && filteredTurmas.length > 0 ? (
          filteredTurmas.map((turma: Turma) => (
            <div
              key={turma.id}
              className="bg-white rounded-lg shadow border border-gray-100 hover:shadow-lg transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {turma.nome}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {turma.descricao}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                      turma.ativa
                        ? "bg-green-100 text-green-800"
                        : "bg-destructive/10 text-destructive"
                    }`}
                >
                  {turma.ativa ? "Ativa" : "Inativa"}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <p>
                  <strong>Horário:</strong> {turma.horario}
                </p>
                <p>
                  <strong>Dias:</strong> {turma.diasSemana}
                </p>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Capacidade: {turma.capacidadeMaxima} alunos</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(turma)}
                  className="flex-1 px-3 py-2 text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition text-sm font-medium"
                >
                  <Edit2 className="h-4 w-4 inline mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => deleteMutation.mutate(turma.id)}
                  className="flex-1 px-3 py-2 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/10 transition text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4 inline mr-1" />
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhuma turma encontrada
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Turma" : "Nova Turma"}
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
                Descrição
              </label>
              <textarea
                value={formData.descricao || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário
              </label>
              <input
                type="text"
                placeholder="Ex: 09:00 - 11:00"
                value={formData.horario || ""}
                onChange={(e) =>
                  setFormData({ ...formData, horario: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias da Semana
              </label>
              <input
                type="text"
                placeholder="Ex: Seg, Qua, Sex"
                value={formData.diasSemana || ""}
                onChange={(e) =>
                  setFormData({ ...formData, diasSemana: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidade Máxima
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacidadeMaxima || 20}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacidadeMaxima: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                Turma Ativa
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
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
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

export default function TurmasPage() {
  return <TurmasContent />;
}
