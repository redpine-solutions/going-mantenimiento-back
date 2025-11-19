import authMiddleware from '@middlewares/auth/authMiddleware';

import { Router } from 'express';

import createClientRouter from './client';
import createUserRouter from './user';

const mainRouter = () => {
  const router = Router();

  router.use('/users', createUserRouter());

  router.use('/clients', createClientRouter());

  router.use(authMiddleware);

  return router;
};

export default mainRouter;
