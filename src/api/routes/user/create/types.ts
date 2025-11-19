type CreateUserRequestDTO = {
  username: string;
  password: string;
  role: 'admin' | 'client';
  clientId?: string;
};

export type { CreateUserRequestDTO };
