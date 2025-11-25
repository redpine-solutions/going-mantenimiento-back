import Measurement from '@models/Measurement';

import { type FindMeasurementsInput, type FindMeasurementsOutput } from './types';

const findMeasurements = async (input: FindMeasurementsInput): Promise<FindMeasurementsOutput> => {
  const { clientId } = input;

  let params = {};
  if (clientId !== undefined) params = { ...params, clientId };

  const measurements = await Measurement.find(params).sort({ date: -1 }).exec();

  return { measurements };
};

export default findMeasurements;
