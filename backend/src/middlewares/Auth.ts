import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/Client';
import { authUtils } from '../utils/Auth';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Token de autenticação não encontrado' });
    }

    try {
      const decoded = authUtils.verifyToken(token) as { usuarioId: number; email: string };

      const usuario = await prisma.usuario.findUnique({
        where: {
          id: decoded.usuarioId,
          email: decoded.email
        },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      (req as any).usuario = usuario;
      next();
    } catch (error: any) {
      return res.status(401).json({ error: 'Token inválido: ' + error.message });
    }
  } catch (error: any) {
    console.error('Erro na autenticação:', error.message);
    return res.status(401).json({ error: 'Não autorizado: ' + error.message });
  }
};
