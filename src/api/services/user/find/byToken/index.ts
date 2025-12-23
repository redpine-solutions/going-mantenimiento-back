import User, { IUser } from '@models/User';
import Client from '@models/Client';

import throwUnauthorizedError from '@errors/throwers/throwUnauthorizedError';

import { getJwtSecret } from '@envs/vairables';

import jwt from 'jsonwebtoken';

import { type FindByTokenInput, type FindByTokenOutput } from './types';

const findByToken = async (input: FindByTokenInput): Promise<FindByTokenOutput> => {
  const { token } = input;

  // 1. Verify JWT token
  let verified: { id: string };
  try {
    verified = jwt.verify(token, getJwtSecret()) as { id: string };
  } catch (error) {
    throwUnauthorizedError({
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  }

  // 2. Find user by ID
  const user = await User.findById(verified!.id).lean().exec();

  // 3. Check if user exists
  if (!user) {
    throwUnauthorizedError({
      message: 'User not found for the provided token',
      code: 'USER_NOT_FOUND',
    });
  }

  // 4. Get client name if user has clientId
  let clientName: string | undefined;
  if (user!.clientId) {
    const client = await Client.findById(user!.clientId).select('name').lean().exec();
    clientName = client?.name;
  }

  // 5. Return explicit result
  return {
    user: user! as unknown as IUser,
    clientName,
  };
};

export default findByToken;
