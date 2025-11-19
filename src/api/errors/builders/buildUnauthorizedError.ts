import ERROR_CODES from "../types/codes";
import ERROR_STATUS from "../types/status";
import buildError from "./buildError";

interface BuildUnauthorizedErrorParams {
  message: string;
  name?: string;
  code?: string;
  cause?: string;
}

const buildUnauthorizedError = ({
  message,
  name = "UnauthorizedError",
  code = ERROR_CODES.GENERIC_ERROR,
  cause = undefined,
}: BuildUnauthorizedErrorParams) =>
  buildError({
    name,
    message,
    status: ERROR_STATUS.UNAUTHORIZED,
    cause,
    code,
  });

export default buildUnauthorizedError;
