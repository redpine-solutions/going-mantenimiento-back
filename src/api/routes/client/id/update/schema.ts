import { type Schema } from 'express-validator';

const updateClientSchema: () => Schema = () => ({
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'id must be a valid MongoDB ObjectId',
    },
  },
  name: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'name must be a string',
    },
    notEmpty: {
      errorMessage: 'name cannot be empty',
    },
    trim: true,
  },
});

export default updateClientSchema;
