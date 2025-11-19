import Client from '@models/Client';
import User from '@models/User';

import throwBadRequestError from '@errors/throwers/throwBadRequestError';
import throwNotFoundError from '@errors/throwers/throwNotFoundError';

import { type DeleteClientInput, type DeleteClientOutput } from './types';

const deleteClient = async (input: DeleteClientInput): Promise<DeleteClientOutput> => {
  const { id } = input;

  // 1. Check if client has associated users
  const usersCount = await User.countDocuments({ clientId: id }).exec();
  if (usersCount > 0) {
    throwBadRequestError({
      message: `Cannot delete client with ${usersCount} associated users`,
      code: 'CLIENT_HAS_USERS',
    });
  }

  // 2. Find and delete client
  const client = await Client.findByIdAndDelete(id).exec();

  // 3. Check if client existed
  if (!client) {
    throwNotFoundError({
      message: `Client with id ${id} not found`,
      code: 'CLIENT_NOT_FOUND',
    });
  }

  // 4. Return explicit result
  return { success: true };
};

export default deleteClient;
