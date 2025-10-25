import { Application } from 'express';
import { initRoutes } from './init.routes';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

export const setupRoutes = (app: Application): void => {
  app.use('/', initRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
};
