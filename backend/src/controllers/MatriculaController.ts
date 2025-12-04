import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const matriculaController = {
  async listar(req: Request, res: Response) {
    try {
      const matriculasRaw = await prisma.matricula.findMany({
        include: {
          aluno: true,
          turma: true
        },
        orderBy: {
          data_matricula: 'desc'
        }
      });
      const matriculas = matriculasRaw.map((m: any) => ({
        id: m.id,
        alunoId: m.alunoId,
        turmaId: m.turmaId,
        dataMatricula: m.data_matricula,
        ativa: m.ativa ?? true,
        alunoNome: m.aluno?.nome,
        turmaNome: m.turma?.nome,
      }));
      res.json(matriculas);
    } catch (error) {
      console.error('Erro ao listar matrículas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async matricular(req: Request, res: Response) {
    try {
      const { alunoId, turmaId } = req.body;

      if (!alunoId || !turmaId) {
        return res.status(400).json({ message: 'alunoId e turmaId são obrigatórios' });
      }

      const aluno = await prisma.aluno.findUnique({
        where: { id: parseInt(alunoId) }
      });

      if (!aluno) {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }

      const turma = await prisma.turma.findUnique({
        where: { id: parseInt(turmaId) },
        include: {
          matriculas: true
        }
      });

      if (!turma) {
        return res.status(404).json({ message: 'Turma não encontrada' });
      }

      if (turma.matriculas.length >= turma.vagas_totais) {
        return res.status(400).json({ message: 'Turma lotada' });
      }

      const matriculaExistente = await prisma.matricula.findFirst({
        where: {
          alunoId: parseInt(alunoId),
          turmaId: parseInt(turmaId)
        }
      });

      if (matriculaExistente) {
        return res.status(400).json({ message: 'Aluno já matriculado nesta turma' });
      }

      const matriculaRaw = await prisma.matricula.create({
        data: {
          alunoId: parseInt(alunoId),
          turmaId: parseInt(turmaId)
        },
        include: {
          aluno: true,
          turma: true
        }
      });

      const matricula = {
        id: matriculaRaw.id,
        alunoId: matriculaRaw.alunoId,
        turmaId: matriculaRaw.turmaId,
        dataMatricula: matriculaRaw.data_matricula,
        ativa: matriculaRaw.ativa ?? true,
        alunoNome: matriculaRaw.aluno?.nome,
        turmaNome: matriculaRaw.turma?.nome,
      };
      res.status(201).json(matricula);
    } catch (error: any) {
      console.error('Erro ao matricular aluno:', error);

      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Aluno ou turma não encontrados' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async desmatricular(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.matricula.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao desmatricular aluno:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Matrícula não encontrada' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarPorTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;

      const matriculasRaw = await prisma.matricula.findMany({
        where: { turmaId: parseInt(turmaId) },
        include: {
          aluno: true
        },
        orderBy: {
          aluno: {
            nome: 'asc'
          }
        }
      });

      const matriculas = matriculasRaw.map((m: any) => ({
        id: m.id,
        alunoId: m.alunoId,
        turmaId: m.turmaId,
        dataMatricula: m.data_matricula,
        ativa: m.ativa ?? true,
        alunoNome: m.aluno?.nome,
        turmaNome: m.turma?.nome,
      }));
      res.json(matriculas);
    } catch (error) {
      console.error('Erro ao listar matrículas por turma:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
