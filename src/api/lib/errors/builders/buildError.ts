import CustomError from '../custom/customError';
import ERROR_CODES from '../types/codes';
import ERROR_STATUS from '../types/status';

interface BuildErrorParams {
  status: number;
  code: string;
  message: string;
  isOperational?: boolean;
  name: string;
  cause: unknown;
  error?: unknown;
}

const buildError = ({
  status = ERROR_STATUS.INTERNAL_SERVER_ERROR,
  code = ERROR_CODES.UNHANDLED_ERROR,
  message = 'Internal server error',
  isOperational = true,
  name = 'Error',
  cause = undefined,
  error = undefined,
}: BuildErrorParams) => {
  const customError = new CustomError(message);
  customError.status = status;
  customError.name = name;
  customError.code = code;
  customError.cause = cause;
  customError.isOperational = isOperational;
  customError.builtError = true;
  customError.error = error;
  return customError;
};

export default buildError;
