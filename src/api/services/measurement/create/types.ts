import { type IMeasurement } from '@models/Measurement';
 
type CreateMeasurementInput = {
  date: Date;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  clientId: string;
};

type CreateMeasurementOutput = {
   measurement: IMeasurement;
};

export type { CreateMeasurementInput, CreateMeasurementOutput };


