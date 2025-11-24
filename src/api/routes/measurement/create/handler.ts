import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import createMeasurement from '@services/measurement/create';

import { type CreateMeasurementRequestDTO } from './types';

const createMeasurementHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as CreateMeasurementRequestDTO;

    // 2. Call service
    const result = await createMeasurement(input);

    // 3. Return response
    res.status(201).json({
      success: true,
      data: result.measurement,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default createMeasurementHandler;


