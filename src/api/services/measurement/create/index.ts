import Measurement from '@models/Measurement';

import { type CreateMeasurementInput, type CreateMeasurementOutput } from './types';

const createMeasurement = async (input: CreateMeasurementInput): Promise<CreateMeasurementOutput> => {
  const { year, month, good, observation, unsatisfactory, danger, unmeasured, clientId, opening } = input;
  const monthIndex = year * 12 + (month - 1);

  const measurement = await Measurement.create({
    year,
    month,
    monthIndex,
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


