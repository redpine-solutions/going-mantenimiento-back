import { type Schema } from 'express-validator';

const meSchema: () => Schema = () => ({
  // Empty schema - token is validated by authMiddleware
});

export default meSchema;
