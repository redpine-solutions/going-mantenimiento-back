import Measurement from '@models/Measurement';

import { type CreateMeasurementInput, type CreateMeasurementOutput } from './types';

const createMeasurement = async (input: CreateMeasurementInput): Promise<CreateMeasurementOutput> => {
  const { date, good, observation, unsatisfactory, danger, unmeasured, clientId, opening } = input;

  const measurement = await Measurement.create({
    date,
    good,
    observation,
    unsatisfactory,
    danger,
    unmeasured,
    opening,
    clientId,
  });

  return { measurement };
};

export default createMeasurement;


