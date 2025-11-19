import schemaCheck from '@middlewares/schemaCheck';
import authMiddleware from '@middlewares/auth/authMiddleware';

import { Router } from 'express';

import loginHandler from './login/handler';
import loginSchema from './login/schema';
import meHandler from './me/handler';
import meSchema from './me/schema';

const createAuthRouter = (): Router => {
  const authRouter = Router();

  // POST /auth/login - Public route
  authRouter.post('/login', schemaCheck(loginSchema()), loginHandler);

  // GET /auth/me - Protected route
  authRouter.get('/me', authMiddleware, schemaCheck(meSchema()), meHandler);

  return authRouter;
};

export default createAuthRouter;
