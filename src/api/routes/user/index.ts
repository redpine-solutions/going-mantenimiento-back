import schemaCheck from '@middlewares/schemaCheck';

import idSchema from '@utils/schema-validators/idSchema';

import { Router } from 'express';

import createUserHandler from './create/handler';
import createUserSchema from './create/schema';
import createIdRouter from './id';

const createUserRouter = (): Router => {
  const userRouter = Router();

  // POST /users - Create user
  userRouter.post('/', schemaCheck(createUserSchema()), createUserHandler);

  userRouter.use('/:id', schemaCheck(idSchema()), createIdRouter());

  return userRouter;
};

export default createUserRouter;
