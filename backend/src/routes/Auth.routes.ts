import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/Auth';

const router = Router();

router.post('/registrar', authController.registrar);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/perfil', authMiddleware, authController.perfil);
router.put('/perfil', authMiddleware, authController.atualizarPerfil);

export default router;
