import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const turmaController = {
  async listar(req: Request, res: Response) {
    try {
      const turmasRaw = await prisma.turma.findMany({
        include: {
          matriculas: {
            include: {
              aluno: true,
            },
          },
        },
        orderBy: { nome: 'asc' },
      });

      const turmas = turmasRaw.map((t: any) => ({
        id: t.id,
        nome: t.nome,
        horario: t.horario,
        descricao: t.descricao ?? '',
        diasSemana: t.dias_semana,
        capacidadeMaxima: t.vagas_totais,
        ativa: (t.status ?? 'Ativa') === 'Ativa',
        createdAt: t.createdAt,
      }));

      res.json(turmas);
    } catch (error) {
      console.error('Erro ao listar turmas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const turmaRaw = await prisma.turma.findUnique({
        where: { id: parseInt(id) },
        include: {
          matriculas: {
            include: {
              aluno: true,
            },
          },
        },
      });

      if (!turmaRaw) {
        return res.status(404).json({ message: 'Turma não encontrada' });
      }

      const turma = {
        id: turmaRaw.id,
        nome: turmaRaw.nome,
        horario: turmaRaw.horario,
        descricao: turmaRaw.descricao ?? '',
        diasSemana: turmaRaw.dias_semana,
        capacidadeMaxima: turmaRaw.vagas_totais,
        ativa: (turmaRaw.status ?? 'Ativa') === 'Ativa',
        createdAt: turmaRaw.createdAt,
      };

      res.json(turma);
    } catch (error) {
      console.error('Erro ao buscar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const nome = req.body.nome;
      const dias_semana = req.body.dias_semana ?? req.body.diasSemana;
      const horario = req.body.horario;
      const vagas_totais = req.body.vagas_totais ?? req.body.capacidadeMaxima;
      const descricao = req.body.descricao ?? undefined;
      const status = req.body.status ?? (req.body.ativa === false ? 'Inativa' : 'Ativa');

      if (!nome || !dias_semana || !horario || !vagas_totais) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      const turma = await prisma.turma.create({
        data: {
          nome,
          dias_semana,
          horario,
          descricao,
          vagas_totais: parseInt(vagas_totais),
          status: status || 'Ativa',
        },
      });

      const response = {
        id: turma.id,
        nome: turma.nome,
        horario: turma.horario,
        descricao: turma.descricao ?? '',
        diasSemana: turma.dias_semana,
        capacidadeMaxima: turma.vagas_totais,
        ativa: (turma.status ?? 'Ativa') === 'Ativa',
        createdAt: turma.createdAt,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const nome = req.body.nome;
      const dias_semana = req.body.dias_semana ?? req.body.diasSemana;
      const horario = req.body.horario;
      const vagas_totais = req.body.vagas_totais ?? req.body.capacidadeMaxima;
      const descricao = req.body.descricao ?? undefined;
      const status = req.body.status ?? (req.body.ativa === false ? 'Inativa' : req.body.ativa === true ? 'Ativa' : undefined);

      const turma = await prisma.turma.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          dias_semana,
          horario,
          descricao,
          vagas_totais: vagas_totais ? parseInt(vagas_totais) : undefined,
          status,
        },
      });

      const response = {
        id: turma.id,
        nome: turma.nome,
        horario: turma.horario,
        descricao: turma.descricao ?? '',
        diasSemana: turma.dias_semana,
        capacidadeMaxima: turma.vagas_totais,
        ativa: (turma.status ?? 'Ativa') === 'Ativa',
        createdAt: turma.createdAt,
      };

      res.json(response);
    } catch (error: any) {
      console.error('Erro ao atualizar turma:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Turma não encontrada' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.turma.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar turma:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Turma não encontrada' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};
