import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fio-condutor-secret-key-2024'
const JWT_EXPIRES_IN = '24h'

export const authUtils = {
  // Gerar hash da senha
  async hashPassword(senha: string): Promise<string> {
    return bcrypt.hash(senha, 12)
  },

  // Verificar senha
  async verifyPassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash)
  },

  // Gerar token JWT
  generateToken(usuarioId: number, email: string): string {
    return jwt.sign(
      { 
        usuarioId, 
        email,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
  },

  // Verificar token JWT
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      throw new Error('Token inválido')
    }
  },

  // Extrair token do header
  extractToken(authHeader: string | undefined): string {
    if (!authHeader) {
      throw new Error('Token não fornecido')
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Formato do token inválido')
    }

    return parts[1]
  }
}