import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import updateClient from '@services/client/update';

import { type UpdateClientRequestDTO } from './types';

const updateClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as UpdateClientRequestDTO;

    // 2. Call service
    const result = await updateClient(input);

    // 3. Return response
    res.status(200).json({
      success: true,
      data: result.client,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default updateClientHandler;
