import { type IUser } from '@models/User';

type MeInput = {
  token: string;
};

type MeOutput = {
  token: string;
  user: IUser;
};

export type { MeInput, MeOutput };
