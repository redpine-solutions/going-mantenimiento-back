import { type Schema } from 'express-validator';

const loginSchema: () => Schema = () => ({
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
  },
});

export default loginSchema;
