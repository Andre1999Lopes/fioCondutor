import { NextFunction, Request, Response } from 'express';
import { prisma } from '../database/Client';
import { authUtils } from '../utils/Auth';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401).json({error: 'Cabeçalho de autenticação não encontrado'})

    const [bearer, token] = authHeader.split(' ')

    if (bearer !== 'Bearer' || !token) return res.status(401).json({error: 'Cabeçalho de autenticação inválido'})
    
    // Verificar token
    const decoded = authUtils.verifyToken(token) as { usuarioId: number; email: string }
    
    // Verificar se usuário ainda existe no banco usando Prisma
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
    })

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    // Adicionar usuário à request
    (req as any).usuario = usuario
    next()
  } catch (error: any) {
    console.error('Erro na autenticação:', error.message)
    return res.status(401).json({ error: 'Não autorizado: ' + error.message })
  }
}