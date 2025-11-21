import type { IClient } from '@models/Client';

type GetClientByIdInput = {
  params: {
    id: string;
  };
};

type GetClientByIdOutput = IClient;

export type { GetClientByIdInput, GetClientByIdOutput };
