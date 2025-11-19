import { type NextFunction, type Request, type Response } from 'express';

import me from '@services/auth/me';

const meHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Get token from header
    const token = req.header('x-auth-token') as string;

    // 2. Call service
    const result = await me({ token });

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

export default meHandler;
