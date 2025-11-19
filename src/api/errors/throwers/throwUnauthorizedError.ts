import buildUnauthorizedError from "../builders/buildUnauthorizedError";
import throwErrorBase from "./throwErrorBase";

interface ThrowUnauthorizedErrorParams {
  message: string;
  name?: string;
  code?: string;
}

const throwUnauthorizedError = ({
  message,
  name = "UnauthorizedError",
  code = undefined,
}: ThrowUnauthorizedErrorParams) =>
  throwErrorBase(buildUnauthorizedError({ message, name, code }));

export default throwUnauthorizedError;
