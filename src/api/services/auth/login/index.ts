import User from '@models/User';

import throwUnauthorizedError from '@errors/throwers/throwUnauthorizedError';

import { getJwtSecret } from '@envs/vairables';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { type LoginInput, type LoginOutput } from './types';

const login = async (input: LoginInput): Promise<LoginOutput> => {
  const { username, password } = input;

  // 1. Find user by username
  const user = await User.findOne({ username }).exec();
  if (!user) {
    throwUnauthorizedError({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user!.password);
  if (!isMatch) {
    throwUnauthorizedError({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
  }

  // 3. Generate JWT token
  const token = jwt.sign({ id: user!._id }, getJwtSecret(), {
    expiresIn: '7d',
  });

  // 4. Return explicit result
  return { token, user: user! };
};

export default login;
