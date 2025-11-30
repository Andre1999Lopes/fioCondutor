import { Router } from 'express'
import { pagamentoController } from '../controllers/PagamentosController'

const router = Router()

// GET /api/pagamentos - Listar todos os pagamentos
router.get('/', pagamentoController.listar)

// POST /api/pagamentos - Registrar pagamento
router.post('/', pagamentoController.registrar)

// PUT /api/pagamentos/:id/status - Atualizar status do pagamento
router.put('/:id/status', pagamentoController.atualizarStatus)

// GET /api/pagamentos/aluno/:alunoId - Listar pagamentos por aluno
router.get('/aluno/:alunoId', pagamentoController.listarPorAluno)

// GET /api/pagamentos/atrasados - Listar pagamentos atrasados
router.get('/atrasados', pagamentoController.listarAtrasados)

export default router