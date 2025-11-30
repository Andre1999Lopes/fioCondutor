import { Router } from 'express'
import { matriculaController } from '../controllers/MatriculaController'

const router = Router()

// GET /api/matriculas - Listar todas as matrículas
router.get('/', matriculaController.listar)

// POST /api/matriculas - Matricular aluno em turma
router.post('/', matriculaController.matricular)

// DELETE /api/matriculas/:id - Desmatricular aluno
router.delete('/:id', matriculaController.desmatricular)

// GET /api/matriculas/turma/:turmaId - Listar matrículas por turma
router.get('/turma/:turmaId', matriculaController.listarPorTurma)

export default router