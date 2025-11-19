import Client from '@models/Client';

import throwNotFoundError from '@errors/throwers/throwNotFoundError';

import { type UpdateClientInput, type UpdateClientOutput } from './types';

const updateClient = async (input: UpdateClientInput): Promise<UpdateClientOutput> => {
  const { id, name } = input;

  // 1. Find client
  const client = await Client.findById(id).exec();
  if (!client) {
    throwNotFoundError({
      message: `Client with id ${id} not found`,
      code: 'CLIENT_NOT_FOUND',
    });
  }

  // 2. Update fields
  if (name) {
    client!.name = name;
  }

  // 3. Save and return
  await client!.save();

  return { client: client! };
};

export default updateClient;
