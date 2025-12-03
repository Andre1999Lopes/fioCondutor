import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const pagamentoController = {
  async listar(req: Request, res: Response) {
    try {
      const pagamentos = await prisma.pagamento.findMany({
        include: {
          aluno: true,
          plano: true
        },
        orderBy: {
          data_vencimento: 'desc'
        }
      });
      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async registrar(req: Request, res: Response) {
    try {
      const { alunoId, planoId, data_pagamento, mes_referencia } = req.body;

      if (!alunoId || !planoId) {
        return res.status(400).json({ error: 'alunoId e planoId são obrigatórios' });
      }

      const plano = await prisma.plano.findUnique({
        where: { id: parseInt(planoId) }
      });

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      const pagamento = await prisma.pagamento.create({
        data: {
          alunoId: parseInt(alunoId),
          planoId: parseInt(planoId),
          data_vencimento: new Date(),
          data_pagamento: data_pagamento ? new Date(data_pagamento) : new Date(),
          valor: plano.valor,
          mes_referencia: mes_referencia || new Date().toISOString().slice(0, 7),
          status: 'Pago'
        },
        include: {
          aluno: true,
          plano: true
        }
      });

      res.status(201).json(pagamento);
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);

      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Aluno ou plano não encontrados' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizarStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['Pago', 'Pendente', 'Cancelado'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const pagamento = await prisma.pagamento.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          aluno: true,
          plano: true
        }
      });

      res.json(pagamento);
    } catch (error: any) {
      console.error('Erro ao atualizar pagamento:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarPorAluno(req: Request, res: Response) {
    try {
      const { alunoId } = req.params;

      const pagamentos = await prisma.pagamento.findMany({
        where: { alunoId: parseInt(alunoId) },
        include: {
          plano: true
        },
        orderBy: {
          data_vencimento: 'desc'
        }
      });

      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos por aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarAtrasados(req: Request, res: Response) {
    try {
      const hoje = new Date();

      const pagamentosAtrasados = await prisma.pagamento.findMany({
        where: {
          status: 'Pendente',
          data_vencimento: {
            lt: hoje
          }
        },
        include: {
          aluno: true,
          plano: true
        },
        orderBy: {
          data_vencimento: 'asc'
        }
      });

      res.json(pagamentosAtrasados);
    } catch (error) {
      console.error('Erro ao listar pagamentos atrasados:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
