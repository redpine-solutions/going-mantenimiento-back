import ERROR_CODES from "../types/codes";
import ERROR_STATUS from "../types/status";

interface CustomErrorOptions {
  status?: number;
  code?: string;
  isOperational?: boolean;
  cause?: unknown;
  error?: unknown;
}

class CustomError extends Error {
  public status: number;
  public code: string;
  public isOperational: boolean;
  public builtError: boolean;
  public cause: unknown;
  public error: unknown;

  constructor(
    message = "Internal server error",
    options: CustomErrorOptions = {}
  ) {
    super(message);

    this.name = "CustomError";
    this.status = options.status ?? ERROR_STATUS.INTERNAL_SERVER_ERROR;
    this.code = options.code ?? ERROR_CODES.UNHANDLED_ERROR;
    this.isOperational = options.isOperational ?? true;
    this.builtError = true;
    this.cause = options.cause;
    this.error = options.error;

    Error.captureStackTrace(this, CustomError);
  }
}

export default CustomError;
