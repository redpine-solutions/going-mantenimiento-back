import { type IUser } from '@models/User';

type UpdateUserInput = {
  id: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'client';
  clientId?: string;
};

type UpdateUserOutput = {
  user: IUser;
};

export type { UpdateUserInput, UpdateUserOutput };
