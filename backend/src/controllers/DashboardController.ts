import { Request, Response } from 'express'
import { prisma } from '../database/Client'

export const dashboardController = {
  // DADOS RESUMIDOS DO DASHBOARD
  async resumo(req: Request, res: Response) {
    try {
      const [
        totalAlunos,
        totalTurmas,
        turmasAtivas,
        pagamentosEsteMes,
        inadimplentes
      ] = await Promise.all([
        // Total de alunos
        prisma.aluno.count(),

        // Total de turmas
        prisma.turma.count(),

        // Turmas ativas
        prisma.turma.count({ where: { status: 'Ativa' } }),

        // Pagamentos deste mês
        prisma.pagamento.aggregate({
          _sum: { valor: true },
          where: { 
            data_pagamento: { 
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            },
            status: 'Pago'
          }
        }),

        // Inadimplentes (pagamentos pendentes e vencidos)
        prisma.pagamento.count({ 
          where: { 
            status: 'Pendente',
            data_vencimento: { lt: new Date() }
          } 
        })
      ])

      res.json({
        totalAlunos,
        totalTurmas,
        turmasAtivas,
        receitaEsteMes: pagamentosEsteMes._sum.valor || 0,
        totalInadimplentes: inadimplentes
      })
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // RELATÓRIO DE INADIMPLÊNCIA DETALHADO
  async inadimplenciaDetalhada(req: Request, res: Response) {
    try {
      const inadimplentes = await prisma.pagamento.findMany({
        where: { 
          status: 'Pendente',
          data_vencimento: { lt: new Date() }
        },
        include: {
          aluno: {
            select: { id: true, nome: true, email: true, telefone: true }
          },
          plano: true
        },
        orderBy: {
          data_vencimento: 'asc'
        }
      })

      res.json(inadimplentes)
    } catch (error) {
      console.error('Erro ao buscar inadimplentes:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // ESTATÍSTICAS DE MATRÍCULAS POR TURMA
  async matriculasPorTurma(req: Request, res: Response) {
    try {
      const turmasComMatriculas = await prisma.turma.findMany({
        include: {
          matriculas: true
        },
        orderBy: {
          nome: 'asc'
        }
      })

      const estatisticas = turmasComMatriculas.map(turma => ({
        id: turma.id,
        nome: turma.nome,
        vagasTotais: turma.vagas_totais,
        matriculados: turma.matriculas.length,
        vagasDisponiveis: turma.vagas_totais - turma.matriculas.length,
        taxaOcupacao: Math.round((turma.matriculas.length / turma.vagas_totais) * 100)
      }))

      res.json(estatisticas)
    } catch (error) {
      console.error('Erro ao buscar estatísticas de turmas:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}