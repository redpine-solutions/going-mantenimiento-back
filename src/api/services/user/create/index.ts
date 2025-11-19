import User from '@models/User';
import Client from '@models/Client';

import throwBadRequestError from '@errors/throwers/throwBadRequestError';
import throwNotFoundError from '@errors/throwers/throwNotFoundError';

import { type CreateUserInput, type CreateUserOutput } from './types';

const createUser = async (input: CreateUserInput): Promise<CreateUserOutput> => {
  const { username, password, role, clientId } = input;

  // 1. Check if username already exists
  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    throwBadRequestError({
      message: 'Username already exists',
      code: 'USERNAME_EXISTS',
    });
  }

  // 2. If role is client, validate clientId exists
  if (role === 'client') {
    if (!clientId) {
      throwBadRequestError({
        message: 'clientId is required for client role',
        code: 'CLIENT_ID_REQUIRED',
      });
    }

    const client = await Client.findById(clientId).exec();
    if (!client) {
      throwNotFoundError({
        message: `Client with id ${clientId} not found`,
        code: 'CLIENT_NOT_FOUND',
      });
    }
  }

  // 3. Create user
  const user = await User.create({
    username,
    password,
    role,
    clientId: role === 'client' ? clientId : undefined,
  });

  // 4. Return explicit result
  return { user };
};

export default createUser;
