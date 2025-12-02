import { Request, Response } from 'express';
import { prisma } from '../database/Client';
import { authUtils } from '../utils/Auth';

export const authController = {
  // REGISTRAR NOVO USUÁRIO
  async registrar(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      if (senha.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
      }

      // Verificar se email já existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const senhaHash = await authUtils.hashPassword(senha);

      // Criar usuário
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

      // Gerar token
      const token = authUtils.generateToken(usuario.id, usuario.email);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
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

  // LOGIN
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      // Buscar usuário com a senha (precisamos dela para verificação)
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaValida = await authUtils.verifyPassword(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gerar token
      const token = authUtils.generateToken(usuario.id, usuario.email);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
      });
      // Remover senha do response
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

  // PERFIL DO USUÁRIO LOGADO
  async perfil(req: Request, res: Response) {
    try {
      const usuario = (req as any).usuario;
      res.json({ usuario });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  // ATUALIZAR PERFIL
  async atualizarPerfil(req: Request, res: Response) {
    try {
      const usuarioId = (req as any).usuario.id;
      const { nome, email } = req.body;

      if (!nome && !email) {
        return res.status(400).json({ error: 'Nenhum dado para atualizar' });
      }

      // Verificar se novo email já existe
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

      // Atualizar dados
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

      // Gerar novo token se email foi alterado
      if (email) {
        const token = authUtils.generateToken(usuarioAtualizado.id, usuarioAtualizado.email);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 // 1 dia
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
  }
};
