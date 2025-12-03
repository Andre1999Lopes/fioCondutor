import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const turmaController = {
  async listar(req: Request, res: Response) {
    try {
      const turmas = await prisma.turma.findMany({
        include: {
          matriculas: {
            include: {
              aluno: true
            }
          }
        },
        orderBy: {
          nome: 'asc'
        }
      });
      res.json(turmas);
    } catch (error) {
      console.error('Erro ao listar turmas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const turma = await prisma.turma.findUnique({
        where: { id: parseInt(id) },
        include: {
          matriculas: {
            include: {
              aluno: true
            }
          }
        }
      });

      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      res.json(turma);
    } catch (error) {
      console.error('Erro ao buscar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const { nome, dias_semana, horario, vagas_totais, status } = req.body;

      if (!nome || !dias_semana || !horario || !vagas_totais) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const turma = await prisma.turma.create({
        data: {
          nome,
          dias_semana,
          horario,
          vagas_totais: parseInt(vagas_totais),
          status: status || 'Ativa'
        }
      });

      res.status(201).json(turma);
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, dias_semana, horario, vagas_totais, status } = req.body;

      const turma = await prisma.turma.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          dias_semana,
          horario,
          vagas_totais: vagas_totais ? parseInt(vagas_totais) : undefined,
          status
        }
      });

      res.json(turma);
    } catch (error: any) {
      console.error('Erro ao atualizar turma:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.turma.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar turma:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Turma não encontrada' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
