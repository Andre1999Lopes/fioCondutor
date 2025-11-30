import { Router } from 'express'
import { authMiddleware } from '../middlewares/Auth'
import alunoRoutes from './Alunos.routes'
import authRoutes from './Auth.routes'
import dashboardRoutes from './Dashboard.routes'
import matriculaRoutes from './Matriculas.routes'
import pagamentoRoutes from './Pagamentos.routes'
import planoRoutes from './Planos.routes'
import turmaRoutes from './Turmas.routes'

const router = Router()

// Rotas públicas (sem autenticação)
router.use('/auth', authRoutes)

// Rotas protegidas (com autenticação)
router.use('/alunos', authMiddleware, alunoRoutes)
router.use('/turmas', authMiddleware, turmaRoutes)
router.use('/matriculas', authMiddleware, matriculaRoutes)
router.use('/planos', authMiddleware, planoRoutes)
router.use('/pagamentos', authMiddleware, pagamentoRoutes)
router.use('/dashboard', authMiddleware, dashboardRoutes)

export default router