import User from '@models/User';

import type { FindAllUsersInput, FindAllUsersOutput } from './types';

const findAllUsers = async (_input: FindAllUsersInput): Promise<FindAllUsersOutput> => {
  // Query all users ordered by creation date (newest first)
  const users = await User.find().sort({ createdAt: -1 }).exec();

  return users;
};

export default findAllUsers;
