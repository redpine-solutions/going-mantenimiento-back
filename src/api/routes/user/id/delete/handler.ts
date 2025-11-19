import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import deleteUser from '@services/user/delete';

import { type DeleteUserRequestDTO } from './types';

const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as DeleteUserRequestDTO;

    // 2. Call service
    const result = await deleteUser(input);

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

export default deleteUserHandler;
