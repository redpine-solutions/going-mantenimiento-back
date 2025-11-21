import { adminMiddleware } from '@middlewares/auth/adminMiddleware';
import schemaCheck from '@middlewares/schemaCheck';

import { Router } from 'express';

import deleteClientHandler from './delete/handler';
import deleteClientSchema from './delete/schema';
import getClientHandler from './get/handler';
import getClientSchema from './get/schema';
import updateClientHandler from './update/handler';
import updateClientSchema from './update/schema';

const createIdRouter = (): Router => {
  const idRouter = Router();

  // GET /clients/:id - Get Client by ID
  idRouter.get('', schemaCheck(getClientSchema()), getClientHandler);

  // PUT /clients/:id - Update Client
  idRouter.put('', schemaCheck(updateClientSchema()), updateClientHandler);

  // DELETE /clients/:id - Delete Client
  idRouter.delete('', adminMiddleware, schemaCheck(deleteClientSchema()), deleteClientHandler);

  return idRouter;
};

export default createIdRouter;
