import schemaCheck from '@middlewares/schemaCheck';

import { Router } from 'express';

import createMeasurementHandler from './create/handler';
import createMeasurementSchema from './create/schema';
import findMeasurementsHandler from './find/handler';
import findMeasurementsSchema from './find/schema';

const createMeasurementRouter = (): Router => {
  const measurementRouter = Router();

  // GET /measurements?clientId=... - List measurements by client
  measurementRouter.get('/', schemaCheck(findMeasurementsSchema()), findMeasurementsHandler);

  // POST /measurements - Create measurement
  measurementRouter.post('/', schemaCheck(createMeasurementSchema()), createMeasurementHandler);

  return measurementRouter;
};

export default createMeasurementRouter;


