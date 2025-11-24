import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import findMeasurementsByClient from '@services/measurement/find/byClient';

import { type FindMeasurementsRequestDTO } from './types';

const findMeasurementsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as FindMeasurementsRequestDTO;

    // 2. Call service
    const result = await findMeasurementsByClient(input);

    // 3. Return response
    res.status(200).json({
      success: true,
      data: result.measurements,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default findMeasurementsHandler;


