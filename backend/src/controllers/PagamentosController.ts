import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const pagamentoController = {
  async listar(req: Request, res: Response) {
    try {
      const pagamentosRaw = await prisma.pagamento.findMany({
        include: {
          aluno: true,
          plano: true
        },
        orderBy: {
          data_vencimento: 'desc'
        }
      });
      const pagamentos = pagamentosRaw.map((p: any) => ({
        id: p.id,
        alunoId: p.alunoId,
        valor: Number(p.valor),
        dataPagamento: p.data_pagamento,
        dataVencimento: p.data_vencimento,
        status: (p.status || 'Pendente').toLowerCase(),
        descricao: p.mes_referencia || '',
      }));
      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async registrar(req: Request, res: Response) {
    try {
      const { alunoId, planoId, data_pagamento, data_vencimento, mes_referencia, status } = req.body;

      if (!alunoId || !planoId) {
        return res.status(400).json({ message: 'alunoId e planoId são obrigatórios' });
      }

      const plano = await prisma.plano.findUnique({
        where: { id: parseInt(planoId) }
      });

      if (!plano) {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }

      const normalizedStatus = typeof status === 'string'
        ? (status.toLowerCase() === 'pago' ? 'Pago' : status.toLowerCase() === 'pendente' ? 'Pendente' : status.toLowerCase() === 'vencido' ? 'Vencido' : 'Pendente')
        : 'Pendente';

      const pagamentoRaw = await prisma.pagamento.create({
        data: {
          alunoId: parseInt(alunoId),
          planoId: parseInt(planoId),
          data_vencimento: data_vencimento ? new Date(data_vencimento) : new Date(),
          data_pagamento: normalizedStatus === 'Pago' && data_pagamento ? new Date(data_pagamento) : null,
          valor: plano.valor,
          mes_referencia: mes_referencia || new Date().toISOString().slice(0, 7),
          status: normalizedStatus
        },
        include: {
          aluno: true,
          plano: true
        }
      });

      const pagamento = {
        id: pagamentoRaw.id,
        alunoId: pagamentoRaw.alunoId,
        valor: Number(pagamentoRaw.valor),
        dataPagamento: pagamentoRaw.data_pagamento,
        dataVencimento: pagamentoRaw.data_vencimento,
        status: (pagamentoRaw.status || 'Pendente').toLowerCase(),
        descricao: pagamentoRaw.mes_referencia || '',
      };
      res.status(201).json(pagamento);
    } catch (error: any) {

      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Aluno ou plano não encontrados' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizarStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Normalizar status: converter para capitalizado
      let normalizedStatus = status;
      if (typeof status === 'string') {
        const statusLower = status.toLowerCase();
        if (statusLower === 'pago') normalizedStatus = 'Pago';
        else if (statusLower === 'pendente') normalizedStatus = 'Pendente';
        else if (statusLower === 'cancelado') normalizedStatus = 'Cancelado';
        else if (statusLower === 'vencido') normalizedStatus = 'Vencido';
      }

      if (!['Pago', 'Pendente', 'Cancelado', 'Vencido'].includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Status inválido' });
      }

      const pagamentoRaw = await prisma.pagamento.update({
        where: { id: parseInt(id) },
        data: { status: normalizedStatus },
        include: {
          aluno: true,
          plano: true
        }
      });

      const pagamento = {
        id: pagamentoRaw.id,
        alunoId: pagamentoRaw.alunoId,
        valor: Number(pagamentoRaw.valor),
        dataPagamento: pagamentoRaw.data_pagamento,
        dataVencimento: pagamentoRaw.data_vencimento,
        status: (pagamentoRaw.status || 'Pendente').toLowerCase(),
        descricao: pagamentoRaw.mes_referencia || '',
      };
      res.json(pagamento);
    } catch (error: any) {
      console.error('Erro ao atualizar pagamento:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Pagamento não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarPorAluno(req: Request, res: Response) {
    try {
      const { alunoId } = req.params;

      const pagamentosRaw = await prisma.pagamento.findMany({
        where: { alunoId: parseInt(alunoId) },
        include: {
          plano: true
        },
        orderBy: {
          data_vencimento: 'desc'
        }
      });

      const pagamentos = pagamentosRaw.map((p: any) => ({
        id: p.id,
        alunoId: p.alunoId,
        valor: Number(p.valor),
        dataPagamento: p.data_pagamento,
        dataVencimento: p.data_vencimento,
        status: (p.status || 'Pendente').toLowerCase(),
        descricao: p.mes_referencia || '',
      }));
      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos por aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarAtrasados(req: Request, res: Response) {
    try {
      const hoje = new Date();
      const proximosSete = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

      const pagamentosRaw = await prisma.pagamento.findMany({
        where: {
          OR: [
            {
              AND: [
                {
                  OR: [
                    { status: 'Pendente' },
                    { status: 'pendente' },
                    { status: 'Vencido' },
                    { status: 'vencido' }
                  ]
                },
                { data_vencimento: { lt: hoje } }
              ]
            },
            {
              AND: [
                {
                  OR: [
                    { status: 'Pendente' },
                    { status: 'pendente' }
                  ]
                },
                { data_vencimento: { gte: hoje, lte: proximosSete } }
              ]
            }
          ]
        },
        include: {
          aluno: true,
          plano: true
        },
        orderBy: {
          data_vencimento: 'asc'
        }
      });

      const pagamentosAtrasados = pagamentosRaw.map((p: any) => ({
        id: p.id,
        alunoId: p.alunoId,
        valor: Number(p.valor),
        dataPagamento: p.data_pagamento,
        dataVencimento: p.data_vencimento,
        status: (p.status || 'Pendente').toLowerCase(),
        descricao: p.mes_referencia || '',
      }));
      res.json(pagamentosAtrasados);
    } catch (error) {
      console.error('Erro ao listar pagamentos atrasados:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.pagamento.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Pagamento excluído com sucesso' });
    } catch (error: any) {
      console.error('Erro ao excluir pagamento:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Pagamento não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
