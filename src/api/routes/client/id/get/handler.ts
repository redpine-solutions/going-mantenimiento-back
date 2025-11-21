import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import getClientByIdService from '@services/client/get';

import { type GetClientRequestDTO } from './types';

const getClientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = matchedData(req) as GetClientRequestDTO;

    const result = await getClientByIdService({
      params: { id: input.id },
    });

    res.status(200).json({
      success: true,
      data: result,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default getClientHandler;
