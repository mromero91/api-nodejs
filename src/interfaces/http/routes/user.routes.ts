import { Router } from 'express';
import { UserController } from '@interfaces/controllers/UserController';
import { AuthMiddleware } from '@interfaces/middlewares/auth.middleware';

const router = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

router.get('/profile', authMiddleware.authenticate, userController.getProfile);

router.put('/profile', authMiddleware.authenticate, userController.updateProfile);

router.get('/', authMiddleware.authenticate, userController.listUsers);

export const userRoutes = router;
