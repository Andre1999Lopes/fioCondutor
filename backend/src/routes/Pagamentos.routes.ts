import { Router } from 'express';
import { pagamentoController } from '../controllers/PagamentosController';

const router = Router();

router.get('/', pagamentoController.listar);
router.post('/', pagamentoController.registrar);
router.put('/:id/status', pagamentoController.atualizarStatus);
router.delete('/:id', pagamentoController.deletar);
router.get('/aluno/:alunoId', pagamentoController.listarPorAluno);
router.get('/atrasados', pagamentoController.listarAtrasados);

export default router;
