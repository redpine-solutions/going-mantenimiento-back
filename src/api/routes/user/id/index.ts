import schemaCheck from '@middlewares/schemaCheck';

import { Router } from 'express';

import deleteUserHandler from './delete/handler';
import deleteUserSchema from './delete/schema';
import updateUserHandler from './update/handler';
import updateUserSchema from './update/schema';

const createIdRouter = (): Router => {
  const idRouter = Router();

  idRouter.put('', schemaCheck(updateUserSchema()), updateUserHandler);

  // DELETE /users/:id - Delete user
  idRouter.delete('', schemaCheck(deleteUserSchema()), deleteUserHandler);

  return idRouter;
};

export default createIdRouter;
