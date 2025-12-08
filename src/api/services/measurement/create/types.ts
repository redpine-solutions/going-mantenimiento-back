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
  coupling: number;
  mounting: number;
  externalCause: number;
  cavitation: number;
  bearing: number;
  plainBearing: number;
  belts: number;
  structuralDeficiency: number;
  misalignment: number;
  unbalance: number;
  componentWear: number;
  shaft: number;
  electrical: number;
  gear: number;
  aerodynamicForces: number;
  hydraulicForces: number;
  lubrication: number;
  operational: number;
  productLoss: number;
  resonance: number;
  friction: number;
  rollingBearing: number;
  sensorNoSignal: number;
  safety: number;
  noTechnicalInfo: number;
  mechanicalLooseness: number;
  powerTransmission: number;
};

type CreateMeasurementOutput = {
   measurement: IMeasurement;
};

export type { CreateMeasurementInput, CreateMeasurementOutput };


