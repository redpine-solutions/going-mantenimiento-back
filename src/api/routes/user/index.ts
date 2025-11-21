import { adminMiddleware } from '@middlewares/auth/adminMiddleware';
import schemaCheck from '@middlewares/schemaCheck';

import idSchema from '@utils/schema-validators/idSchema';

import { Router } from 'express';

import createUserHandler from './create/handler';
import createUserSchema from './create/schema';
import findUsersHandler from './find/handler';
import findUsersSchema from './find/schema';
import createIdRouter from './id';

const createUserRouter = (): Router => {
  const userRouter = Router();

  // GET /users - List all users (admin only)
  userRouter.get('/', schemaCheck(findUsersSchema()), findUsersHandler);

  // POST /users - Create user
  userRouter.post('/', schemaCheck(createUserSchema()), createUserHandler);

  userRouter.use('/:id', schemaCheck(idSchema()), createIdRouter());

  return userRouter;
};

export default createUserRouter;
