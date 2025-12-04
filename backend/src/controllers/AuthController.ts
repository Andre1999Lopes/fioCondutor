import { Request, Response } from 'express';
import { prisma } from '../database/Client';
import { authUtils } from '../utils/Auth';

export const authController = {
  async registrar(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      if (senha.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
      }

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const senhaHash = await authUtils.hashPassword(senha);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash
        },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });

      const token = authUtils.generateToken(usuario.id, usuario.email);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: usuario
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const senhaValida = await authUtils.verifyPassword(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = authUtils.generateToken(usuario.id, usuario.email);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      const { senha: _, ...usuarioSemSenha } = usuario;
      res.json({
        message: 'Login realizado com sucesso',
        user: usuarioSemSenha
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async perfil(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      res.json({ usuario });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizarPerfil(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).usuario.id;
      const { nome, email } = req.body;

      if (!nome && !email) {
        return res.status(400).json({ error: 'Nenhum dado para atualizar' });
      }

      if (email) {
        const usuarioComEmail = await prisma.usuario.findFirst({
          where: {
            email,
            NOT: { id: usuarioId }
          }
        });
        if (usuarioComEmail) {
          return res.status(400).json({ error: 'Email já cadastrado por outro usuário' });
        }
      }

      const usuarioAtualizado = await prisma.usuario.update({
        where: { id: usuarioId },
        data: { nome, email },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });

      if (email) {
        const token = authUtils.generateToken(usuarioAtualizado.id, usuarioAtualizado.email);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }

      res.json({
        message: 'Perfil atualizado com sucesso',
        usuario: usuarioAtualizado
      });
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};
