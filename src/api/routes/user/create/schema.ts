import { type Schema } from 'express-validator';

const createUserSchema: () => Schema = () => ({
  username: {
    in: ['body'],
    isString: {
      errorMessage: 'username must be a string',
    },
    notEmpty: {
      errorMessage: 'username is required',
    },
    trim: true,
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'password must be a string',
    },
    notEmpty: {
      errorMessage: 'password is required',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'password must be at least 6 characters',
    },
  },
  role: {
    in: ['body'],
    isIn: {
      options: [['admin', 'client']],
      errorMessage: 'role must be either admin or client',
    },
    notEmpty: {
      errorMessage: 'role is required',
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

export default createUserSchema;
