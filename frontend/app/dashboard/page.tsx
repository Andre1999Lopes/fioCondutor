"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BarChart3,
  CreditCard,
  GraduationCap,
  Users,
} from "lucide-react";

function DashboardContent() {
  const { data: resumo, isLoading: loadingResumo, error: errorResumo } = useQuery({
    queryKey: ["dashboard-resumo"],
    queryFn: () => {
      console.log("Fazendo requisição para /dashboard/resumo");
      return dashboardApi.getResumo().then((res) => {
        console.log("Resposta resumo:", res.data);
        return res.data;
      });
    },
  });

  const { data: inadimplencia, isLoading: loadingInadimplencia, error: errorInadimplencia } = useQuery({
    queryKey: ["dashboard-inadimplencia"],
    queryFn: () => {
      console.log("Fazendo requisição para /dashboard/inadimplencia");
      return dashboardApi.getInadimplencia().then((res) => {
        console.log("Resposta inadimplencia:", res.data);
        return res.data;
      });
    },
  });

  // Log dos erros
  if (errorResumo) console.error("Erro ao buscar resumo:", errorResumo);
  if (errorInadimplencia) console.error("Erro ao buscar inadimplência:", errorInadimplencia);

  const stats = [
    {
      label: "Total de Alunos",
      value: resumo?.totalAlunos || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Turmas Ativas",
      value: resumo?.turmasAtivas || 0,
      icon: GraduationCap,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Matrículas",
      value: resumo?.totalMatriculas || 0,
      icon: BarChart3,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Arrecadação (mês)",
      value: `R$ ${(resumo?.arrecadacaoMes || 0).toFixed(2)}`,
      icon: CreditCard,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao sistema Fio Condutor</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  {loadingResumo ? (
                    <Skeleton className="h-8 w-24 mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inadimplência */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-bold text-gray-900">Pendências de Pagamento</h2>
        </div>

        {loadingInadimplencia ? (
          <div className="space-y-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : inadimplencia && inadimplencia.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-600 font-medium">
                  <th className="py-2">Aluno</th>
                  <th className="py-2">Valor Devido</th>
                  <th className="py-2">Dias em Atraso</th>
                </tr>
              </thead>
              <tbody>
                {inadimplencia.slice(0, 5).map((item: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3">{item.alunoNome}</td>
                    <td className="py-3 font-semibold text-red-600">
                      R$ {item.valorDevido?.toFixed(2)}
                    </td>
                    <td className="py-3">{item.diasAtraso} dias</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Nenhuma pendência no momento</p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
