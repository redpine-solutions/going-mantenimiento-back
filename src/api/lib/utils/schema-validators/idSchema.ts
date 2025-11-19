import { Schema } from 'express-validator';
import { DefaultSchemaKeys } from 'express-validator/lib/middlewares/schema';

import isValidUUID from '../validators/isValidUUID';

const idSchema = (): Schema<DefaultSchemaKeys> => ({
  id: {
    in: ['params'],
    custom: {
      options: isValidUUID,
    },
    optional: false,
    errorMessage: 'Fund id must be a uuid',
  },
});

export default idSchema;
