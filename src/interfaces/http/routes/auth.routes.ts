import { Router } from 'express';
import { AuthController } from '@interfaces/controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);

router.post('/login', authController.login);

export const authRoutes = router;
