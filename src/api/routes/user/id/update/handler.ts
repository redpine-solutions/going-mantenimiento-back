import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import updateUser from '@services/user/update';

import { type UpdateUserRequestDTO } from './types';

const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as UpdateUserRequestDTO;

    // 2. Call service
    const result = await updateUser(input);

    // 3. Return response
    res.status(200).json({
      success: true,
      data: result.user,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default updateUserHandler;
