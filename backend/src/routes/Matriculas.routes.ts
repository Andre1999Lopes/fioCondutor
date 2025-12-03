import { Router } from 'express';
import { matriculaController } from '../controllers/MatriculaController';

const router = Router();

router.get('/', matriculaController.listar);
router.post('/', matriculaController.matricular);
router.delete('/:id', matriculaController.desmatricular);
router.get('/turma/:turmaId', matriculaController.listarPorTurma);

export default router;
