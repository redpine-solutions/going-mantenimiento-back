import { type IUser } from '@models/User';

type CreateUserInput = {
  username: string;
  password: string;
  role: 'admin' | 'client';
  clientId?: string;
};

type CreateUserOutput = {
  user: IUser;
};

export type { CreateUserInput, CreateUserOutput };
