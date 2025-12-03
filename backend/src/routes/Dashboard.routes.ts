import { Router } from 'express';
import { dashboardController } from '../controllers/DashboardController';

const router = Router();

router.get('/resumo', dashboardController.resumo);
router.get('/inadimplencia', dashboardController.inadimplenciaDetalhada);
router.get('/matriculas-turma', dashboardController.matriculasPorTurma);

export default router;
