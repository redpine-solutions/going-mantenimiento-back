import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import findAllClients from '@services/client/find/all';

import { type FindClientsRequestDTO } from './types';

const findClientsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as FindClientsRequestDTO;

    // 2. Call service
    const result = await findAllClients(input);

    // 3. Return response
    res.status(200).json({
      success: true,
      data: result.clients,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default findClientsHandler;
