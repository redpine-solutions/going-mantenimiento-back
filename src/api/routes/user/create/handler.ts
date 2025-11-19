import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import createUser from '@services/user/create';

import { type CreateUserRequestDTO } from './types';

const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as CreateUserRequestDTO;

    // 2. Call service
    const result = await createUser(input);

    // 3. Return response
    res.status(201).json({
      success: true,
      data: result.user,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default createUserHandler;
