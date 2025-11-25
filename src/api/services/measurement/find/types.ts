import { type IMeasurement } from '@models/Measurement';

type FindMeasurementsInput = {
  clientId?: string;
};

type FindMeasurementsOutput = {
  measurements: IMeasurement[];
};

export type { FindMeasurementsInput, FindMeasurementsOutput };
