import { type Schema } from 'express-validator';

const updateUserSchema: () => Schema = () => ({
  username: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'username must be a string',
    },
    notEmpty: {
      errorMessage: 'username cannot be empty',
    },
    trim: true,
  },
  password: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'password must be a string',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'password must be at least 6 characters',
    },
  },
  role: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [['admin', 'client']],
      errorMessage: 'role must be either admin or client',
    },
  },
  clientId: {
    in: ['body'],
    optional: true,
    isMongoId: {
      errorMessage: 'clientId must be a valid MongoDB ObjectId',
    },
  },
});

export default updateUserSchema;
