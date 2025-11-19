import ERROR_CODES from "../types/codes";
import ERROR_STATUS from "../types/status";
import buildError from "./buildError";

interface BuildBadRequestErrorParams {
  message: string;
  name?: string;
  code?: string;
  cause?: string;
}

const buildBadRequestError = ({
  message = "Bad Request",
  name = "BadRequestError",
  code = ERROR_CODES.GENERIC_ERROR,
  cause = undefined,
}: BuildBadRequestErrorParams) =>
  buildError({
    name,
    message,
    status: ERROR_STATUS.BAD_REQUEST,
    code,
    cause,
  });

export default buildBadRequestError;
