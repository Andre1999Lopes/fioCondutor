import { Router } from 'express'
import { dashboardController } from '../controllers/DashboardController'

const router = Router()

// GET /api/dashboard/resumo - Dados resumidos do dashboard
router.get('/resumo', dashboardController.resumo)

// GET /api/dashboard/inadimplencia - Relatório de inadimplência detalhado
router.get('/inadimplencia', dashboardController.inadimplenciaDetalhada)

// GET /api/dashboard/matriculas-turma - Estatísticas de matrículas por turma
router.get('/matriculas-turma', dashboardController.matriculasPorTurma)

export default router