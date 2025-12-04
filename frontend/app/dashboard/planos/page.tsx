"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { planosApi } from "@/lib/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface Plano {
  id: number;
  nome: string;
  descricao: string;
  valor: number;
  duracao: number;
  ativo: boolean;
}

function PlanosContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Plano>>({
    nome: "",
    descricao: "",
    valor: 0,
    duracao: 1,
    ativo: true,
  });

  const { data: planos, isLoading } = useQuery({
    queryKey: ["planos"],
    queryFn: () => planosApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Plano>) => planosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planos"] });
      setIsDialogOpen(false);
      setFormData({
        nome: "",
        descricao: "",
        valor: 0,
        duracao: 1,
        ativo: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Plano>) =>
      editingId ? planosApi.update(editingId, data) : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planos"] });
      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({
        nome: "",
        descricao: "",
        valor: 0,
        duracao: 1,
        ativo: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => planosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Garantir que duracao tem um valor válido
    const dataToSend = {
      ...formData,
      duracao: formData.duracao && formData.duracao > 0 ? formData.duracao : 1,
    };
    
    if (editingId) {
      updateMutation.mutate(dataToSend);
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  const handleEdit = (plano: Plano) => {
    setFormData(plano);
    setEditingId(plano.id);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({
      nome: "",
      descricao: "",
      valor: 0,
      duracao: 1,
      ativo: true,
    });
    setIsDialogOpen(true);
  };

  const filteredPlanos = planos?.filter((plano: Plano) =>
    plano.nome.toLowerCase().includes(search.toLowerCase()) ||
    plano.descricao.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planos</h1>
          <p className="text-gray-600">Gerenciar planos de matrícula</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="h-5 w-5" />
          Novo Plano
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
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
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Duração (meses)
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
                <td colSpan={6} className="px-6 py-4">
                  <Skeleton className="h-12" />
                </td>
              </tr>
            ) : filteredPlanos && filteredPlanos.length > 0 ? (
              filteredPlanos.map((plano: Plano) => (
                <tr key={plano.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {plano.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {plano.descricao}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    R$ {plano.valor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {plano.duracao}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        plano.ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {plano.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(plano)}
                        className="p-2 text-primary hover:bg-primary/10 rounded transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(plano.id)}
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
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Nenhum plano encontrado
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
              {editingId ? "Editar Plano" : "Novo Plano"}
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.valor || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    valor: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duração (meses)
              </label>
              <input
                type="number"
                min="1"
                value={formData.duracao || 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duracao: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.ativo || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ativo: e.target.checked,
                    })
                  }
                  className="rounded focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm font-medium text-gray-700">
                  Ativo
                </span>
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

export default function PlanosPage() {
  return <PlanosContent />;
}