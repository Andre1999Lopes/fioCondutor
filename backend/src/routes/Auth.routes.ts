import { Router } from 'express'
import { authController } from '../controllers/AuthController'
import { authMiddleware } from '../middlewares/Auth'

const router = Router()

// POST /api/auth/registrar - Registrar novo usuário
router.post('/registrar', authController.registrar)

// POST /api/auth/login - Fazer login
router.post('/login', authController.login)

// GET /api/auth/perfil - Ver perfil (protegido)
router.get('/perfil', authMiddleware, authController.perfil)

// PUT /api/auth/perfil - Atualizar perfil (protegido)
router.put('/perfil', authMiddleware, authController.atualizarPerfil)

export default router