import { type Schema } from 'express-validator';

const createMeasurementSchema: () => Schema = () => ({
  year: {
    in: ['body'],
    isInt: {
      options: { min: 1970 },
      errorMessage: 'year must be an integer >= 1970',
    },
    toInt: true,
  },
  month: {
    in: ['body'],
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: 'month must be an integer between 1 and 12',
    },
    toInt: true,
  },
  good: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'good must be a non-negative integer',
    },
    toInt: true,
  },
  observation: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'observation must be a non-negative integer',
    },
    toInt: true,
  },
  unsatisfactory: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'unsatisfactory must be a non-negative integer',
    },
    toInt: true,
  },
  danger: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'danger must be a non-negative integer',
    },
    toInt: true,
  },
  opening: {
    in: ['body'],
    isString: {
      errorMessage: 'opening must be a string',
    },
    notEmpty: {
      errorMessage: 'opening is required',
    },
  },
  unmeasured: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'unmeasured must be a non-negative integer',
    },
    toInt: true,
  },
  clientId: {
    in: ['body'],
    isMongoId: {
      errorMessage: 'clientId must be a valid MongoId',
    },
  },
  coupling: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'coupling must be a non-negative integer',
    },
    toInt: true,
  },
  mounting: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'mounting must be a non-negative integer',
    },
    toInt: true,
  },
  externalCause: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'externalCause must be a non-negative integer',
    },
    toInt: true,
  },
  cavitation: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'cavitation must be a non-negative integer',
    },
    toInt: true,
  },
  bearing: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'bearing must be a non-negative integer',
    },
    toInt: true,
  },
  plainBearing: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'plainBearing must be a non-negative integer',
    },
    toInt: true,
  },
  belts: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'belts must be a non-negative integer',
    },
    toInt: true,
  },
  structuralDeficiency: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'structuralDeficiency must be a non-negative integer',
    },
    toInt: true,
  },
  misalignment: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'misalignment must be a non-negative integer',
    },
    toInt: true,
  },
  unbalance: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'unbalance must be a non-negative integer',
    },
    toInt: true,
  },
  componentWear: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'componentWear must be a non-negative integer',
    },
    toInt: true,
  },
  shaft: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'shaft must be a non-negative integer',
    },
    toInt: true,
  },
  electrical: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'electrical must be a non-negative integer',
    },
    toInt: true,
  },
  gear: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'gear must be a non-negative integer',
    },
    toInt: true,
  },
  aerodynamicForces: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'aerodynamicForces must be a non-negative integer',
    },
    toInt: true,
  },
  hydraulicForces: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'hydraulicForces must be a non-negative integer',
    },
    toInt: true,
  },
  lubrication: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'lubrication must be a non-negative integer',
    },
    toInt: true,
  },
  operational: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'operational must be a non-negative integer',
    },
    toInt: true,
  },
  productLoss: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'productLoss must be a non-negative integer',
    },
    toInt: true,
  },
  resonance: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'resonance must be a non-negative integer',
    },
    toInt: true,
  },
  friction: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'friction must be a non-negative integer',
    },
    toInt: true,
  },
  rollingBearing: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'rollingBearing must be a non-negative integer',
    },
    toInt: true,
  },
  sensorNoSignal: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'sensorNoSignal must be a non-negative integer',
    },
    toInt: true,
  },
  safety: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'safety must be a non-negative integer',
    },
    toInt: true,
  },
  noTechnicalInfo: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'noTechnicalInfo must be a non-negative integer',
    },
    toInt: true,
  },
  mechanicalLooseness: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'mechanicalLooseness must be a non-negative integer',
    },
    toInt: true,
  },
  powerTransmission: {
    in: ['body'],
    isInt: {
      options: { min: 0 },
      errorMessage: 'powerTransmission must be a non-negative integer',
    },
    toInt: true,
  },
});

export default createMeasurementSchema;


