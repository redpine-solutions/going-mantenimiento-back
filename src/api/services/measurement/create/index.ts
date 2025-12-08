import Measurement from '@models/Measurement';

import { type CreateMeasurementInput, type CreateMeasurementOutput } from './types';

const createMeasurement = async (input: CreateMeasurementInput): Promise<CreateMeasurementOutput> => {
  const {
    year,
    month,
    good,
    observation,
    unsatisfactory,
    danger,
    unmeasured,
    clientId,
    opening,
    coupling,
    mounting,
    externalCause,
    cavitation,
    bearing,
    plainBearing,
    belts,
    structuralDeficiency,
    misalignment,
    unbalance,
    componentWear,
    shaft,
    electrical,
    gear,
    aerodynamicForces,
    hydraulicForces,
    lubrication,
    operational,
    productLoss,
    resonance,
    friction,
    rollingBearing,
    sensorNoSignal,
    safety,
    noTechnicalInfo,
    mechanicalLooseness,
    powerTransmission,
  } = input;
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
    coupling,
    mounting,
    externalCause,
    cavitation,
    bearing,
    plainBearing,
    belts,
    structuralDeficiency,
    misalignment,
    unbalance,
    componentWear,
    shaft,
    electrical,
    gear,
    aerodynamicForces,
    hydraulicForces,
    lubrication,
    operational,
    productLoss,
    resonance,
    friction,
    rollingBearing,
    sensorNoSignal,
    safety,
    noTechnicalInfo,
    mechanicalLooseness,
    powerTransmission,
  });

  return { measurement };
};

export default createMeasurement;


