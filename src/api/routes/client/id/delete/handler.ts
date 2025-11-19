import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import deleteClient from '@services/client/delete';

import { type DeleteClientRequestDTO } from './types';

const deleteClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as DeleteClientRequestDTO;

    // 2. Call service
    const result = await deleteClient(input);

    // 3. Return response
    res.status(200).json({
      success: true,
      data: result,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default deleteClientHandler;
