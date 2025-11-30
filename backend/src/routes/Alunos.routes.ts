import { Router } from 'express'
import { alunoController } from '../controllers/AlunoController'

const router = Router()

// GET /api/alunos - Listar todos os alunos
router.get('/', alunoController.listar)

// GET /api/alunos/:id - Buscar aluno por ID
router.get('/:id', alunoController.buscarPorId)

// POST /api/alunos - Criar novo aluno
router.post('/', alunoController.criar)

// PUT /api/alunos/:id - Atualizar aluno
router.put('/:id', alunoController.atualizar)

// DELETE /api/alunos/:id - Deletar aluno
router.delete('/:id', alunoController.deletar)

export default router