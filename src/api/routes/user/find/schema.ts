import { type Schema } from 'express-validator';

const findUsersSchema = (): Schema => ({
  // No parameters required for listing all users
});

export default findUsersSchema;
