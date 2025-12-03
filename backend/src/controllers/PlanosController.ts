import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const planoController = {
  async listar(req: Request, res: Response) {
    try {
      const planos = await prisma.plano.findMany({
        orderBy: {
          nome: 'asc'
        }
      });
      res.json(planos);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plano = await prisma.plano.findUnique({
        where: { id: parseInt(id) }
      });

      if (!plano) {
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      res.json(plano);
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const { nome, valor } = req.body;

      if (!nome || !valor) {
        return res.status(400).json({ error: 'Nome e valor são obrigatórios' });
      }

      const plano = await prisma.plano.create({
        data: {
          nome,
          valor: parseFloat(valor)
        }
      });

      res.status(201).json(plano);
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, valor } = req.body;

      const plano = await prisma.plano.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          valor: valor ? parseFloat(valor) : undefined
        }
      });

      res.json(plano);
    } catch (error: any) {
      console.error('Erro ao atualizar plano:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Plano não encontrado' });
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
        return res.status(404).json({ error: 'Plano não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
