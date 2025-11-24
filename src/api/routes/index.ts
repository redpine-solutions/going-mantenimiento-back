import { adminMiddleware } from '@middlewares/auth/adminMiddleware';
import authMiddleware from '@middlewares/auth/authMiddleware';

import { Router } from 'express';

import createAuthRouter from './auth';
import createClientRouter from './client';
import createMeasurementRouter from './measurement';
import createUserRouter from './user';

const mainRouter = () => {
  const router = Router();

  // Public routes
  router.use('/auth', createAuthRouter());

  // Protected routes
  router.use(authMiddleware);
  router.use('/users', adminMiddleware, createUserRouter());
  router.use('/clients', createClientRouter());
  router.use('/measurements', createMeasurementRouter());

  return router;
};

export default mainRouter;
