import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import findAllUsersService from '@services/user/find/all';

import { type FindUsersRequestDTO } from './types';

const findUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = matchedData(req) as FindUsersRequestDTO;

    const result = await findAllUsersService(input);

    res.status(200).json({
      success: true,
      data: result,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default findUsersHandler;
