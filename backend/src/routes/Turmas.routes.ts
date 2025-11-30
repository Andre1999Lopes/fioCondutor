import { Router } from 'express'
import { turmaController } from '../controllers/TurmaController'

const router = Router()

// GET /api/turmas - Listar todas as turmas
router.get('/', turmaController.listar)

// GET /api/turmas/:id - Buscar turma por ID
router.get('/:id', turmaController.buscarPorId)

// POST /api/turmas - Criar nova turma
router.post('/', turmaController.criar)

// PUT /api/turmas/:id - Atualizar turma
router.put('/:id', turmaController.atualizar)

// DELETE /api/turmas/:id - Deletar turma
router.delete('/:id', turmaController.deletar)

export default router