import { type IUser } from '@models/User';

type MeInput = {
  token: string;
};

type MeOutput = {
  token: string;
  user: IUser;
  clientName?: string;
};

export type { MeInput, MeOutput };
