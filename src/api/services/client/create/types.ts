import { type IClient } from '@models/Client';

type CreateClientInput = {
  name: string;
};

type CreateClientOutput = {
  client: IClient;
};

export type { CreateClientInput, CreateClientOutput };
