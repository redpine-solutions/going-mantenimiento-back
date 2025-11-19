import { type Schema } from 'express-validator';

const createClientSchema: () => Schema = () => ({
  name: {
    in: ['body'],
    isString: {
      errorMessage: 'name must be a string',
    },
    notEmpty: {
      errorMessage: 'name is required',
    },
    trim: true,
  },
});

export default createClientSchema;
