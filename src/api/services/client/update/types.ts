import { type IClient } from '@models/Client';

type UpdateClientInput = {
  id: string;
  name?: string;
};

type UpdateClientOutput = {
  client: IClient;
};

export type { UpdateClientInput, UpdateClientOutput };
