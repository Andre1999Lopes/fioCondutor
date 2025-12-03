import { Router } from 'express';
import { turmaController } from '../controllers/TurmaController';

const router = Router();

router.get('/', turmaController.listar);
router.get('/:id', turmaController.buscarPorId);
router.post('/', turmaController.criar);
router.put('/:id', turmaController.atualizar);
router.delete('/:id', turmaController.deletar);

export default router;
