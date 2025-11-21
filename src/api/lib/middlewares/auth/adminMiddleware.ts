import throwUnauthorizedError from '@errors/throwers/throwUnauthorizedError';

import { type NextFunction, type Request, type Response } from 'express';

/**
 * Middleware to check if the authenticated user has admin privileges.
 * Must be used AFTER authMiddleware to ensure req.user is populated.
 * Throws UnauthorizedError if user is not an admin.
 */
const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Check if user exists (should be populated by authMiddleware)
    if (!req.user) {
      throwUnauthorizedError({
        message: 'Authentication required. Please log in first.',
        code: 'AUTH_REQUIRED',
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      throwUnauthorizedError({
        message: 'Access denied. Admin privileges required.',
        code: 'ADMIN_REQUIRED',
      });
    }

    next();
    return;
  } catch (err) {
    return next(err);
  }
};

export { adminMiddleware };
