import { Router } from 'express';
import { planoController } from '../controllers/PlanosController';

const router = Router();

router.get('/', planoController.listar);
router.get('/:id', planoController.buscarPorId);
router.post('/', planoController.criar);
router.put('/:id', planoController.atualizar);
router.delete('/:id', planoController.deletar);

export default router;
