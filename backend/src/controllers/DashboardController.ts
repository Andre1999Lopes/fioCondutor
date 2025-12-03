import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const dashboardController = {
  async resumo(req: Request, res: Response) {
    try {
      const [totalAlunos, totalTurmas, turmasAtivas, totalMatriculas, pagamentosEsteMes, inadimplentes] =
        await Promise.all([
          prisma.aluno.count(),
          prisma.turma.count(),
          prisma.turma.count({ where: { status: 'Ativa' } }),
          prisma.matricula.count(),
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

          prisma.pagamento.count({
            where: {
              status: 'Pendente',
              data_vencimento: { lt: new Date() }
            }
          })
        ]);

      res.json({
        totalAlunos,
        totalTurmas,
        turmasAtivas,
        totalMatriculas,
        arrecadacaoMes: pagamentosEsteMes._sum.valor || 0,
        totalInadimplentes: inadimplentes
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

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
      });

      const resultado = inadimplentes.map((item) => {
        const diasAtraso = Math.floor(
          (new Date().getTime() - new Date(item.data_vencimento).getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          id: item.id,
          alunoNome: item.aluno.nome,
          alunoId: item.aluno.id,
          valorDevido: item.valor,
          diasAtraso,
          dataVencimento: item.data_vencimento,
          status: item.status
        };
      });

      res.json(resultado);
    } catch (error) {
      console.error('Erro ao buscar inadimplentes:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async matriculasPorTurma(req: Request, res: Response) {
    try {
      const turmasComMatriculas = await prisma.turma.findMany({
        include: {
          matriculas: true
        },
        orderBy: {
          nome: 'asc'
        }
      });

      const estatisticas = turmasComMatriculas.map((turma) => ({
        id: turma.id,
        nome: turma.nome,
        vagasTotais: turma.vagas_totais,
        matriculados: turma.matriculas.length,
        vagasDisponiveis: turma.vagas_totais - turma.matriculas.length,
        taxaOcupacao: Math.round((turma.matriculas.length / turma.vagas_totais) * 100)
      }));

      res.json(estatisticas);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de turmas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
