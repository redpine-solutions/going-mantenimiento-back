import { type Schema } from 'express-validator';

const getClientSchema = (): Schema => ({
  // ID validation is handled by the parent router's idSchema
});

export default getClientSchema;
