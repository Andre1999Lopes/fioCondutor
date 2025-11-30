import { Router } from 'express'
import { planoController } from '../controllers/PlanosController'

const router = Router()

// GET /api/planos - Listar todos os planos
router.get('/', planoController.listar)

// GET /api/planos/:id - Buscar plano por ID
router.get('/:id', planoController.buscarPorId)

// POST /api/planos - Criar novo plano
router.post('/', planoController.criar)

// PUT /api/planos/:id - Atualizar plano
router.put('/:id', planoController.atualizar)

// DELETE /api/planos/:id - Deletar plano
router.delete('/:id', planoController.deletar)

export default router