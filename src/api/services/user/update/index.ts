import User from '@models/User';
import Client from '@models/Client';

import throwBadRequestError from '@errors/throwers/throwBadRequestError';
import throwNotFoundError from '@errors/throwers/throwNotFoundError';

import { type UpdateUserInput, type UpdateUserOutput } from './types';

const updateUser = async (input: UpdateUserInput): Promise<UpdateUserOutput> => {
  const { id, username, password, role, clientId } = input;

  // 1. Find user
  const user = await User.findById(id).exec();
  if (!user) {
    throwNotFoundError({
      message: `User with id ${id} not found`,
      code: 'USER_NOT_FOUND',
    });
  }

  // 2. If updating username, check it's not taken
  if (username && username !== user!.username) {
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      throwBadRequestError({
        message: 'Username already exists',
        code: 'USERNAME_EXISTS',
      });
    }
    user!.username = username;
  }

  // 3. Update password if provided
  if (password) {
    user!.password = password;
  }

  // 4. Handle role change
  const newRole = role || user!.role;
  if (newRole === 'client') {
    const newClientId = clientId || user!.clientId?.toString();
    if (!newClientId) {
      throwBadRequestError({
        message: 'clientId is required for client role',
        code: 'CLIENT_ID_REQUIRED',
      });
    }

    const client = await Client.findById(newClientId).exec();
    if (!client) {
      throwNotFoundError({
        message: `Client with id ${newClientId} not found`,
        code: 'CLIENT_NOT_FOUND',
      });
    }
    user!.clientId = client!._id;
  } else {
    user!.clientId = undefined;
  }

  if (role) {
    user!.role = role;
  }

  // 5. Save and return
  await user!.save();

  return { user: user! };
};

export default updateUser;
