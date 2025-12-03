import { type Schema } from 'express-validator';

const findMeasurementsSchema: () => Schema = () => ({
  clientId: {
    in: ['query'],
    isMongoId: {
      errorMessage: 'clientId must be a valid MongoId',
    },
    optional: true,
  },
  year: {
    in: ['query'],
    isInt: {
      options: { min: 1970 },
      errorMessage: 'year must be an integer >= 1970',
    },
    toInt: true,
    optional: true,
  },
  month: {
    in: ['query'],
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: 'month must be an integer between 1 and 12',
    },
    toInt: true,
    optional: true,
  },
  last12: {
    in: ['query'],
    isBoolean: {
      errorMessage: 'last12 must be a boolean',
    },
    toBoolean: true,
    optional: true,
  },
});

export default findMeasurementsSchema;
