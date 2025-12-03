import { type Schema } from 'express-validator';

const createMeasurementSchema: () => Schema = () => ({
  year: {
    in: ['body'],
    isInt: {
      options: { min: 1970 },
      errorMessage: 'year must be an integer >= 1970',
    },
    toInt: true,
  },
  month: {
    in: ['body'],
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: 'month must be an integer between 1 and 12',
    },
    toInt: true,
  },
  good: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'good must be a non-negative integer',
    },
    toInt: true,
  },
  observation: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'observation must be a non-negative integer',
    },
    toInt: true,
  },
  unsatisfactory: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'unsatisfactory must be a non-negative integer',
    },
    toInt: true,
  },
  danger: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'danger must be a non-negative integer',
    },
    toInt: true,
  },
  opening: {
    in: ['body'],
    isString: {
      errorMessage: 'opening must be a string',
    },
    notEmpty: {
      errorMessage: 'opening is required',
    },
  },
  unmeasured: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'unmeasured must be a non-negative integer',
    },
    toInt: true,
  },
  clientId: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'clientId must be a valid MongoId',
    },
  },
});

export default createMeasurementSchema;


