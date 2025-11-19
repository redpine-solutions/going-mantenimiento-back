import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import login from '@services/auth/login';

import { type LoginRequestDTO } from './types';

const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as LoginRequestDTO;

    // 2. Call service
    const result = await login(input);

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

export default loginHandler;
