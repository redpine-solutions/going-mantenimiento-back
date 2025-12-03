import Measurement from '@models/Measurement';

import { type FindMeasurementsInput, type FindMeasurementsOutput } from './types';

const findMeasurements = async (input: FindMeasurementsInput): Promise<FindMeasurementsOutput> => {
  const { clientId, year, month, last12 } = input;

  let params = {};
  if (clientId !== undefined) params = { ...params, clientId };
  if (year !== undefined && month !== undefined) {
    const monthIndex = year * 12 + (month - 1);
    params = { ...params, monthIndex };
  } else if (last12 === true) {
    const now = new Date();
    const nowIndex = now.getUTCFullYear() * 12 + now.getUTCMonth(); // month 0-11
    const from = nowIndex - 11;
    params = { ...params, monthIndex: { $gte: from } };
  }

  const measurements = await Measurement.find(params).sort({ monthIndex: 1, createdAt: 1 }).exec();

  return { measurements };
};

export default findMeasurements;
