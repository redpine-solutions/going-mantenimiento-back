import { type Schema } from 'express-validator';

const createMeasurementSchema: () => Schema = () => ({
  date: {
    in: ['body'],
    isISO8601: {
      errorMessage: 'date must be a valid ISO8601 date',
    },
    toDate: true,
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


