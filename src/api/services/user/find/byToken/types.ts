import { IUser } from '@models/User';

type FindByTokenInput = {
  token: string;
};

type FindByTokenOutput = {
  user: IUser;
  clientName?: string;
};

export type { FindByTokenInput, FindByTokenOutput };
