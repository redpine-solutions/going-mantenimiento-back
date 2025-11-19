import { type IUser } from '@models/User';

type LoginInput = {
  username: string;
  password: string;
};

type LoginOutput = {
  token: string;
  user: IUser;
};

export type { LoginInput, LoginOutput };
