import { type Schema } from 'express-validator';

const deleteClientSchema: () => Schema = () => ({
  id: {
    in: ['params'],
    isMongoId: {
      errorMessage: 'id must be a valid MongoDB ObjectId',
    },
  },
});

export default deleteClientSchema;
