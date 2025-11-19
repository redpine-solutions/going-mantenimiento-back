import Client from '@models/Client';

import { type FindAllClientsInput, type FindAllClientsOutput } from './types';

const findAllClients = async (_input: FindAllClientsInput): Promise<FindAllClientsOutput> => {
  // 1. Find all clients
  const clients = await Client.find().sort({ createdAt: -1 }).exec();

  // 2. Return explicit result
  return { clients };
};

export default findAllClients;
