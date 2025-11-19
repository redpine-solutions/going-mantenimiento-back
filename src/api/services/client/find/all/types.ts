import { type IClient } from '@models/Client';

type FindAllClientsInput = {
  // Empty for now, can add pagination/filters later
};

type FindAllClientsOutput = {
  clients: IClient[];
};

export type { FindAllClientsInput, FindAllClientsOutput };
