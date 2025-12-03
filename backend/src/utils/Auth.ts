import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '1h';

export const authUtils = {
  async hashPassword(senha: string): Promise<string> {
    return bcrypt.hash(senha, 12);
  },

  async verifyPassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  },

  generateToken(usuarioId: number, email: string): string {
    return jwt.sign(
      {
        usuarioId,
        email,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  extractToken(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new Error('Token não fornecido');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Formato do token inválido');
    }

    return parts[1];
  }
};
