import schemaCheck from '@middlewares/schemaCheck';

import { Router } from 'express';

import deleteClientHandler from './delete/handler';
import deleteClientSchema from './delete/schema';
import updateClientHandler from './update/handler';
import updateClientSchema from './update/schema';

const createIdRouter = (): Router => {
  const idRouter = Router();

  idRouter.put('', schemaCheck(updateClientSchema()), updateClientHandler);

  // DELETE /clients/:id - Delete Client
  idRouter.delete('', schemaCheck(deleteClientSchema()), deleteClientHandler);

  return idRouter;
};

export default createIdRouter;
