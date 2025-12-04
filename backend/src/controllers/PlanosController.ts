import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const planoController = {
  async listar(req: Request, res: Response) {
    try {
      const planosRaw = await prisma.plano.findMany({
        orderBy: {
          nome: 'asc'
        }
      });
      const planos = planosRaw.map((p: any) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao ?? '',
        valor: Number(p.valor),
        duracao: p.duracao ?? 0,
        ativo: p.ativo ?? true,
      }));
      res.json(planos);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const planoRaw = await prisma.plano.findUnique({
        where: { id: parseInt(id) }
      });

      if (!planoRaw) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }
      const plano = {
        id: planoRaw.id,
        nome: planoRaw.nome,
        descricao: planoRaw.descricao ?? '',
        valor: Number(planoRaw.valor),
        duracao: planoRaw.duracao ?? 0,
        ativo: planoRaw.ativo ?? true,
      };
      res.json(plano);
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const { nome, valor, descricao, duracao, ativo } = req.body;
      
      if (!nome || valor === undefined) {
        return res.status(400).json({ message: 'Nome e valor são obrigatórios' });
      }

      const duracaoFinal = duracao !== undefined && duracao !== null && duracao !== '' ? parseInt(duracao) : null;
      const planoRaw = await prisma.plano.create({
        data: {
          nome,
          valor: parseFloat(valor),
          descricao,
          duracao: duracaoFinal,
          ativo: ativo !== undefined ? Boolean(ativo) : true,
        }
      });
      
      const plano = {
        id: planoRaw.id,
        nome: planoRaw.nome,
        descricao: planoRaw.descricao ?? '',
        valor: Number(planoRaw.valor),
        duracao: planoRaw.duracao ?? 0,
        ativo: planoRaw.ativo ?? true,
      };
      res.status(201).json(plano);
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, valor, descricao, duracao, ativo } = req.body;

      const duracaoFinal = duracao !== undefined && duracao !== null && duracao !== '' ? parseInt(duracao) : undefined;

      const planoRaw = await prisma.plano.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          valor: valor !== undefined ? parseFloat(valor) : undefined,
          descricao,
          duracao: duracaoFinal,
          ativo: ativo !== undefined ? Boolean(ativo) : undefined,
        }
      });
      
      const plano = {
        id: planoRaw.id,
        nome: planoRaw.nome,
        descricao: planoRaw.descricao ?? '',
        valor: Number(planoRaw.valor),
        duracao: planoRaw.duracao ?? 0,
        ativo: planoRaw.ativo ?? true,
      };
      res.json(plano);
    } catch (error: any) {
      console.error('Erro ao atualizar plano:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.plano.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar plano:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Plano não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
