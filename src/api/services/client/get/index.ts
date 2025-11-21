import Client from '@models/Client';

import throwNotFound from '@errors/throwers/throwNotFoundError';

import type { GetClientByIdInput, GetClientByIdOutput } from './types';

const getClientById = async (input: GetClientByIdInput): Promise<GetClientByIdOutput> => {
  // Query client by ID
  const client = await Client.findById(input.params.id).exec();

  // Check if client exists
  if (!client) {
    throwNotFound({
      message: 'Client not found',
    });
  }

  return client!;
};

export default getClientById;
