import findByToken from '@services/user/find/byToken';

import { type NextFunction, type Request, type Response } from 'express';

// chequea que el user esté logeado
const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      res.status(401).json({ msg: 'No authentication token, authorization denied.' });
      return;
    }

    const { user } = await findByToken({ token });

    req.user = user;

    next();
    return;
  } catch (err) {
    return next(err);
  }
};

export default authMiddleware;
