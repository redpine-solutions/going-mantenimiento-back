type UpdateUserRequestDTO = {
  id: string;
  username?: string;
  password?: string;
  role?: 'admin' | 'client';
  clientId?: string;
};

export type { UpdateUserRequestDTO };
