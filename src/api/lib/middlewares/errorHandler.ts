import { logger } from '@logs/index';

import { NextFunction, Request, Response } from 'express';

import CustomError from '../../errors/custom/customError';
import { getNodeEnv } from '../environment/vairables';

const errorHandler = (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);

  const devError = {
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params,
    },
    stack: err.stack,
  };
  const errorFormatted = {
    status: err.status || 500,
    message: err.message,
    name: err.name,
    error: err.error,
    cause: err.cause,
    code: err.code,
    timestamp: new Date().toISOString(),
    ...(getNodeEnv() === 'production' ? {} : { ...devError }),
  };
  logger.error(errorFormatted);

  return res.json(errorFormatted);
};

export default errorHandler;
