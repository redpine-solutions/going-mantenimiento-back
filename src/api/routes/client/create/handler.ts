import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import createClient from '@services/client/create';

import { type CreateClientRequestDTO } from './types';

const createClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as CreateClientRequestDTO;

    // 2. Call service
    const result = await createClient(input);

    // 3. Return response
    res.status(201).json({
      success: true,
      data: result.client,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default createClientHandler;
