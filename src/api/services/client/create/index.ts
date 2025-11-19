import Client from '@models/Client';

import { type CreateClientInput, type CreateClientOutput } from './types';

const createClient = async (input: CreateClientInput): Promise<CreateClientOutput> => {
  const { name } = input;

  // 1. Create client
  const client = await Client.create({ name });

  // 2. Return explicit result
  return { client };
};

export default createClient;
