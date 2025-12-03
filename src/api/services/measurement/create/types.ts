import { type IMeasurement } from '@models/Measurement';
 
type CreateMeasurementInput = {
  year: number;
  month: number;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  opening: string;
  clientId: string;
};

type CreateMeasurementOutput = {
   measurement: IMeasurement;
};

export type { CreateMeasurementInput, CreateMeasurementOutput };


