import { Request, Response } from 'express'
import { prisma } from '../database/Client'

export const alunoController = {
  // LISTAR TODOS OS ALUNOS
  async listar(req: Request, res: Response) {
    try {
      const alunos = await prisma.aluno.findMany({
        include: {
          matriculas: {
            include: {
              turma: true
            }
          },
          pagamentos: true
        },
        orderBy: {
          nome: 'asc'
        }
      })
      res.json(alunos)
    } catch (error) {
      console.error('Erro ao listar alunos:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // BUSCAR ALUNO POR ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params
      const aluno = await prisma.aluno.findUnique({
        where: { id: parseInt(id) },
        include: {
          matriculas: {
            include: {
              turma: true
            }
          },
          pagamentos: {
            include: {
              plano: true
            }
          }
        }
      })

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' })
      }

      res.json(aluno)
    } catch (error) {
      console.error('Erro ao buscar aluno:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // CRIAR NOVO ALUNO
  async criar(req: Request, res: Response) {
    try {
      const { nome, email, telefone, cpf, endereco } = req.body

      // Validar campos obrigatórios
      if (!nome || !email || !cpf) {
        return res.status(400).json({ error: 'Nome, email e CPF são obrigatórios' })
      }

      const aluno = await prisma.aluno.create({
        data: {
          nome,
          email,
          telefone,
          cpf,
          endereco
        }
      })

      res.status(201).json(aluno)
    } catch (error: any) {
      console.error('Erro ao criar aluno:', error)
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email ou CPF já cadastrado' })
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // ATUALIZAR ALUNO
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { nome, email, telefone, cpf, endereco } = req.body

      const aluno = await prisma.aluno.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          email,
          telefone,
          cpf,
          endereco
        }
      })

      res.json(aluno)
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error)
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Aluno não encontrado' })
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  },

  // DELETAR ALUNO
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.aluno.delete({
        where: { id: parseInt(id) }
      })

      res.status(204).send()
    } catch (error: any) {
      console.error('Erro ao deletar aluno:', error)
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Aluno não encontrado' })
      }
      
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}