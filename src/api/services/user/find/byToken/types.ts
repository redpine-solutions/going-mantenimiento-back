import { type IUser } from '@models/User';

type FindByTokenInput = {
  token: string;
};

type FindByTokenOutput = {
  user: IUser;
};

export type { FindByTokenInput, FindByTokenOutput };
