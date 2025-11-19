import { NextFunction, Request, Response } from 'express';

import buildNotFoundError from '@errors/builders/buildNotFoundError';

const notFoundHandler = (req: Request, _: Response, next: NextFunction) =>
  next(
    buildNotFoundError({
      message: `Route not found: ${req.originalUrl}`,
    })
  );

export default notFoundHandler;
