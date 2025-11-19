import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import buildBadRequestError from '@errors/builders/buildBadRequestError';

const validationErrorsHandler = (req: Request, _: Response, next: NextFunction) => {
  const requestErrors = validationResult(req);
  if (!requestErrors.isEmpty()) {
    const errorArray = requestErrors.array();
    const jointErrors = errorArray.map((e) => e.msg).join(',\n');
    const error = buildBadRequestError({
      message: jointErrors,
      cause: errorArray.join(','),
    });
    return next(error);
  }
  return next();
};

export default validationErrorsHandler;
