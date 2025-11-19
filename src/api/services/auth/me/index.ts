import findByToken from '@services/user/find/byToken';

import { type MeInput, type MeOutput } from './types';

const me = async (input: MeInput): Promise<MeOutput> => {
  const { token } = input;

  // 1. Get user from token
  const { user } = await findByToken({ token });

  // 2. Return explicit result
  return { token, user };
};

export default me;
