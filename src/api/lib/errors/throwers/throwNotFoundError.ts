import buildNotFoundError from '../builders/buildNotFoundError';
import throwErrorBase from './throwErrorBase';

interface ThrowNotFoundErrorParams {
  message: string;
  name?: string;
  code?: string;
}

const throwNotFound = ({
  message,
  name = 'NotFoundError',
  code = undefined,
}: ThrowNotFoundErrorParams) => throwErrorBase(buildNotFoundError({ message, name, code }));

export default throwNotFound;
