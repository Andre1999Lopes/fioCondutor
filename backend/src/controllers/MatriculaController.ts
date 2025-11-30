import { Request, Response } from 'express'
import { prisma } from '../database/Client'

export const matriculaController = {
  // LISTAR TODAS AS MATRÍCULAS
  async listar(req: Request, res: Response) {
    try {
      const matriculas = await prisma.matricula.findMany({
        include: {
          aluno: true,
          turma: true
        },
        orderBy: {
          data_matricula: 'desc'
        }
      })
      res.json(matriculas)
    } catch (error) {
      console.error('Erro ao listar matrículas:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // MATRICULAR ALUNO EM TURMA
  async matricular(req: Request, res: Response) {
    try {
      const { alunoId, turmaId } = req.body

      if (!alunoId || !turmaId) {
        return res.status(400).json({ error: 'alunoId e turmaId são obrigatórios' })
      }

      // Verificar se aluno existe
      const aluno = await prisma.aluno.findUnique({
        where: { id: parseInt(alunoId) }
      })

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' })
      }

      // Verificar se turma existe e tem vagas
      const turma = await prisma.turma.findUnique({
        where: { id: parseInt(turmaId) },
        include: {
          matriculas: true
        }
      })

      if (!turma) {
        return res.status(404).json({ error: 'Turma não encontrada' })
      }

      if (turma.matriculas.length >= turma.vagas_totais) {
        return res.status(400).json({ error: 'Turma lotada' })
      }

      // Verificar se aluno já está matriculado nesta turma
      const matriculaExistente = await prisma.matricula.findFirst({
        where: {
          alunoId: parseInt(alunoId),
          turmaId: parseInt(turmaId)
        }
      })

      if (matriculaExistente) {
        return res.status(400).json({ error: 'Aluno já matriculado nesta turma' })
      }

      const matricula = await prisma.matricula.create({
        data: {
          alunoId: parseInt(alunoId),
          turmaId: parseInt(turmaId)
        },
        include: {
          aluno: true,
          turma: true
        }
      })

      res.status(201).json(matricula)
    } catch (error: any) {
      console.error('Erro ao matricular aluno:', error)
      
      if (error.code === 'P2003') {
        return res.status(400).json({ error: 'Aluno ou turma não encontrados' })
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // DESMATRICULAR ALUNO
  async desmatricular(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.matricula.delete({
        where: { id: parseInt(id) }
      })

      res.status(204).send()
    } catch (error: any) {
      console.error('Erro ao desmatricular aluno:', error)
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Matrícula não encontrada' })
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // LISTAR MATRÍCULAS POR TURMA
  async listarPorTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params

      const matriculas = await prisma.matricula.findMany({
        where: { turmaId: parseInt(turmaId) },
        include: {
          aluno: true
        },
        orderBy: {
          aluno: {
            nome: 'asc'
          }
        }
      })

      res.json(matriculas)
    } catch (error) {
      console.error('Erro ao listar matrículas por turma:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}