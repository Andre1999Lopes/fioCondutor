import { Request, Response } from 'express';
import { prisma } from '../database/Client';

export const alunoController = {
  async listar(req: Request, res: Response) {
    try {
      const alunosRaw = await prisma.aluno.findMany({
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
      });
      const alunos = alunosRaw.map((a: any) => ({
        id: a.id,
        nome: a.nome,
        email: a.email,
        telefone: a.telefone ?? '',
        cpf: a.cpf,
        endereco: a.endereco ?? '',
      }));
      res.json(alunos);
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const alunoRaw = await prisma.aluno.findUnique({
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
      });

      if (!alunoRaw) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const aluno = {
        id: alunoRaw.id,
        nome: alunoRaw.nome,
        email: alunoRaw.email,
        telefone: alunoRaw.telefone ?? '',
        cpf: alunoRaw.cpf,
        endereco: alunoRaw.endereco ?? '',
      };
      res.json(aluno);
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const { nome, email, telefone, cpf, endereco } = req.body;

      if (!nome || !email || !cpf) {
        return res.status(400).json({ message: 'Nome, email e CPF são obrigatórios' });
      }

      const aluno = await prisma.aluno.create({
        data: {
          nome,
          email,
          telefone,
          cpf,
          endereco
        }
      });

      res.status(201).json({
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
        telefone: aluno.telefone ?? '',
        cpf: aluno.cpf,
        endereco: aluno.endereco ?? '',
      });
    } catch (error: any) {
      console.error('Erro ao criar aluno:', error);

      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Email ou CPF já cadastrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, cpf, endereco } = req.body;

      const aluno = await prisma.aluno.update({
        where: { id: parseInt(id) },
        data: {
          nome,
          email,
          telefone,
          cpf,
          endereco
        }
      });

      res.json(aluno);
    } catch (error: any) {
      console.error('Erro ao atualizar aluno:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Aluno não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.aluno.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Erro ao deletar aluno:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
