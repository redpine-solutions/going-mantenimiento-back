import { type IMeasurement } from '@models/Measurement';

type FindMeasurementsByClientInput = {
  clientId: string;
};

type FindMeasurementsByClientOutput = {
  measurements: IMeasurement[];
};

export type { FindMeasurementsByClientInput, FindMeasurementsByClientOutput };


