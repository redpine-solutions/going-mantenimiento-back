import buildBadRequestError from "../builders/buildBadRequestError";
import throwErrorBase from "./throwErrorBase";

interface ThrowBadRequestError {
  message: string;
  name?: string;
  code?: string;
}
const throwBadRequestError = ({
  message,
  name = "BadRequestError",
  code = undefined,
}: ThrowBadRequestError) =>
  throwErrorBase(buildBadRequestError({ message, name, code }));

export default throwBadRequestError;
