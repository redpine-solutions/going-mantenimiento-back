import findMeasurements from '@services/measurement/find';

import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import { type FindMeasurementsRequestDTO } from './types';

const findMeasurementsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as FindMeasurementsRequestDTO;
    const clientId =
      req.user.role === 'client' && req.user.clientId !== undefined
        ? req.user.clientId.toString()
        : input.clientId;

  if (!clientId) {
    throw new Error('Client ID is required');
  }
    // 2. Call service
    const result = await findMeasurements({ ...input, clientId });

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
