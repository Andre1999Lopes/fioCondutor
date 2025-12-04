"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { alunosApi, pagamentosApi, planosApi } from "@/lib/api/api";
import { toast } from "@/lib/hooks/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface Pagamento {
  id: number;
  alunoId: number;
  valor: number;
  dataPagamento: string;
  dataVencimento: string;
  status: "pago" | "pendente" | "vencido";
  descricao: string;
}

function PagamentosContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [formData, setFormData] = useState<Partial<Pagamento>>({
    alunoId: 0,
    dataPagamento: "",
    dataVencimento: "",
    status: "pendente",
    descricao: "",
  });

  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ["pagamentos"],
    queryFn: () => pagamentosApi.getAll().then((res) => res.data),
  });

  const { data: alunos } = useQuery({
    queryKey: ["alunos"],
    queryFn: () => alunosApi.getAll().then((res) => res.data),
  });

  const { data: planos } = useQuery({
    queryKey: ["planos"],
    queryFn: () => planosApi.getAll().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Pagamento>) => pagamentosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-resumo"] });
      setIsDialogOpen(false);
      setFormData({ alunoId: 0, dataPagamento: "", dataVencimento: "", status: "pendente", descricao: "" });
      toast.success("Pagamento criado");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Erro ao criar pagamento";
      toast.error(String(msg));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: number; status: string }) =>
      pagamentosApi.updateStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-resumo"] });
      toast.success("Status atualizado");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Erro ao atualizar status";
      toast.error(String(msg));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pagamentosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-resumo"] });
      toast.success("Pagamento excluído");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Erro ao excluir pagamento";
      toast.error(String(msg));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.alunoId || !formData.descricao || !formData.dataVencimento) {
      toast.error("Preencha aluno, descrição e vencimento");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleNew = () => {
    setFormData({ alunoId: 0, dataPagamento: "", dataVencimento: "", status: "pendente", descricao: "" });
    setIsDialogOpen(true);
  };

  const filteredPagamentos = pagamentos?.filter((pag: Pagamento) => {
    const matchSearch =
      pag.descricao.toLowerCase().includes(search.toLowerCase()) ||
      pag.valor.toString().includes(search);
    const matchStatus = filterStatus === "todos" || pag.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800";
      case "pendente":
        return "bg-accent/10 text-accent";
      case "vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="h-4 w-4" />;
      case "vencido":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
          <p className="text-gray-600">Controle financeiro do ateliê</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="h-5 w-5" />
          Novo Pagamento
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por descrição ou valor..."
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
          <option value="todos">Todos os Status</option>
          <option value="pago">Pago</option>
          <option value="pendente">Pendente</option>
          <option value="vencido">Vencido</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Vencimento
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
            ) : filteredPagamentos && filteredPagamentos.length > 0 ? (
              filteredPagamentos.map((pag: Pagamento) => (
                <tr key={pag.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {pag.descricao}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    R$ {pag.valor.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(pag.dataVencimento).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        pag.status
                      )}`}
                    >
                      {getStatusIcon(pag.status)}
                      {pag.status.charAt(0).toUpperCase() + pag.status.slice(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {pag.status !== "pago" && (
                        <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: pag.id,
                                status: "pago",
                              })
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition text-xs font-medium"
                          >
                          Marcar como Pago
                        </button>
                      )}
                        <button
                          onClick={() => deleteMutation.mutate(pag.id)}
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
                  Nenhum pagamento encontrado
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
            <DialogTitle>Novo Pagamento</DialogTitle>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                Descrição
              </label>
              <input
                type="text"
                placeholder="Ex: Mensalidade - Novembro"
                value={formData.descricao || ""}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plano
              </label>
              <select
                value={(formData as any).planoId || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    // @ts-expect-error dynamic field
                    planoId: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              >
                <option value={0}>Selecione um plano</option>
                {planos?.map((plano: any) => (
                  <option key={plano.id} value={plano.id}>
                    {plano.nome} — R$ {Number(plano.valor).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={formData.dataVencimento || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dataVencimento: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status || "pendente"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>

            {formData.status === "pago" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Pagamento
                </label>
                <input
                  type="date"
                  value={formData.dataPagamento || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dataPagamento: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
            )}

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
                Criar
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PagamentosPage() {
  return <PagamentosContent />;
}
