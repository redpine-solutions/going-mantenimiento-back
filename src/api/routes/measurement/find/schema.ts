import { type Schema } from 'express-validator';

const findMeasurementsSchema: () => Schema = () => ({
  clientId: {
    in: ['query'],
    isMongoId: {
      errorMessage: 'clientId must be a valid MongoId',
    },
    notEmpty: {
      errorMessage: 'clientId is required',
    },
  },
});

export default findMeasurementsSchema;


