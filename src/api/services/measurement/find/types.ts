import { type IMeasurement } from '@models/Measurement';

type FindMeasurementsInput = {
  clientId?: string;
  year?: number;
  month?: number;
  last12?: boolean;
};

type FindMeasurementsOutput = {
  measurements: IMeasurement[];
};

export type { FindMeasurementsInput, FindMeasurementsOutput };
