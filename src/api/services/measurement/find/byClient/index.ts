import Measurement from '@models/Measurement';

import { type FindMeasurementsByClientInput, type FindMeasurementsByClientOutput } from './types';

const findMeasurementsByClient = async (
  input: FindMeasurementsByClientInput,
): Promise<FindMeasurementsByClientOutput> => {
  const { clientId } = input;

  const measurements = await Measurement.find({ clientId }).sort({ date: -1 }).exec();

  return { measurements };
};

export default findMeasurementsByClient;


