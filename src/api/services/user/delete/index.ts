import User from '@models/User';

import throwNotFoundError from '@errors/throwers/throwNotFoundError';

import { type DeleteUserInput, type DeleteUserOutput } from './types';

const deleteUser = async (input: DeleteUserInput): Promise<DeleteUserOutput> => {
  const { id } = input;

  // 1. Find and delete user
  const user = await User.findByIdAndDelete(id).exec();

  // 2. Check if user existed
  if (!user) {
    throwNotFoundError({
      message: `User with id ${id} not found`,
      code: 'USER_NOT_FOUND',
    });
  }

  // 3. Return explicit result
  return { success: true };
};

export default deleteUser;
