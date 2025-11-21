import type { IUser } from '@models/User';

type FindAllUsersInput = Record<string, never>;

type FindAllUsersOutput = IUser[];

export type { FindAllUsersInput, FindAllUsersOutput };
