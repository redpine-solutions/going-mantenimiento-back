import schemaCheck from '@middlewares/schemaCheck';

import idSchema from '@utils/schema-validators/idSchema';

import { Router } from 'express';

import findClientsHandler from './find/handler';
import findClientsSchema from './find/schema';
import createIdRouter from './id';

const createClientRouter = (): Router => {
  const clientRouter = Router();

  // GET /clients - List all clients
  clientRouter.get('/', schemaCheck(findClientsSchema()), findClientsHandler);

  clientRouter.use('/:id', schemaCheck(idSchema()), createIdRouter());

  return clientRouter;
};
export default createClientRouter;
