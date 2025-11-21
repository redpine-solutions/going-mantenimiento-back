import { adminMiddleware } from '@middlewares/auth/adminMiddleware';
import schemaCheck from '@middlewares/schemaCheck';

import idSchema from '@utils/schema-validators/idSchema';

import { Router } from 'express';

import createClientHandler from './create/handler';
import createClientSchema from './create/schema';
import findClientsHandler from './find/handler';
import findClientsSchema from './find/schema';
import createIdRouter from './id';

const createClientRouter = (): Router => {
  const clientRouter = Router();

  // GET /clients - List all clients
  clientRouter.get('/', adminMiddleware, schemaCheck(findClientsSchema()), findClientsHandler);

  // POST /clients - Create client
  clientRouter.post('/', adminMiddleware, schemaCheck(createClientSchema()), createClientHandler);

  clientRouter.use('/:id', schemaCheck(idSchema()), createIdRouter());

  return clientRouter;
};
export default createClientRouter;
