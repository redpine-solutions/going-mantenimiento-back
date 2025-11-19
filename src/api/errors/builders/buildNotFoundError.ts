import ERROR_CODES from "../types/codes";
import ERROR_STATUS from "../types/status";
import buildError from "./buildError";

interface BuildNotFoundErrorParams {
  message: string;
  name?: string;
  code?: string;
  cause?: string;
}

const buildNotFoundError = ({
  message,
  name = "NotFoundError",
  code = ERROR_CODES.GENERIC_ERROR,
  cause = undefined,
}: BuildNotFoundErrorParams) =>
  buildError({
    name,
    message,
    status: ERROR_STATUS.NOT_FOUND,
    cause,
    code,
  });

export default buildNotFoundError;
