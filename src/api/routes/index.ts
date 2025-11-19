import authMiddleware from '@middlewares/auth/authMiddleware';

import { Router } from 'express';

import createAuthRouter from './auth';
import createClientRouter from './client';
import createUserRouter from './user';

const mainRouter = () => {
  const router = Router();

  // Public routes
  router.use('/auth', createAuthRouter());

  // Protected routes
  router.use(authMiddleware);
  router.use('/users', createUserRouter());
  router.use('/clients', createClientRouter());

  return router;
};

export default mainRouter;
