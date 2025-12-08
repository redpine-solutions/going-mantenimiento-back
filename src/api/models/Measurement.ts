import { type Document, model, Schema, Types } from 'mongoose';

interface IMeasurement extends Document {
  year: number;
  month: number; // 1-12
  monthIndex: number; // year*12 + (month - 1)
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  opening: string;
  clientId: Types.ObjectId;
  // New fields for causes/conditions
  coupling: number; // ACOPLAMIENTO
  mounting: number; // ANCLAJE
  externalCause: number; // CAUSA EXTERNA
  cavitation: number; // CAVITACIÓN
  bearing: number; // COJINETE
  plainBearing: number; // COJINETES PLANOS
  belts: number; // CORREAS
  structuralDeficiency: number; // DEFIC. ESTRUCTURAL
  misalignment: number; // DESALINEACIÓN
  unbalance: number; // DESBALANCEO
  componentWear: number; // DESGASTE COMPONENTES
  shaft: number; // EJE
  electrical: number; // ELÉCTRICO
  gear: number; // ENGRANE
  aerodynamicForces: number; // FUERZAS AERODINÁMICAS
  hydraulicForces: number; // FUERZAS HIDRÁULICAS
  lubrication: number; // LUBRICACIÓN
  operational: number; // OPERACIONAL
  productLoss: number; // PÉRDIDA DE PRODUCTO
  resonance: number; // RESONANCIA
  friction: number; // ROCE
  rollingBearing: number; // RODAMIENTO
  sensorNoSignal: number; // SENSOR SIN SEÑAL
  safety: number; // SEGURIDAD
  noTechnicalInfo: number; // SIN INFO. TÉCNICA
  mechanicalLooseness: number; // SOLTURA MECÁNICA
  powerTransmission: number; // TRANSMISIÓN DE POTENCIA
  createdAt: Date;
  updatedAt: Date;
}

const measurementSchema = new Schema<IMeasurement>(
  {
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1970,
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    monthIndex: {
      type: Number,
      required: [true, 'MonthIndex is required'],
      min: 0,
    },
    good: {
      type: Number,
      required: [true, 'Good is required'],
      min: 0,
    },
    observation: {
      type: Number,
      required: [true, 'Observation is required'],
      min: 0,
    },
    unsatisfactory: {
      type: Number,
      required: [true, 'Unsatisfactory is required'],
      min: 0,
    },
    danger: {
      type: Number,
      required: [true, 'Danger is required'],
      min: 0,
    },
    unmeasured: {
      type: Number,
      required: [true, 'Unmeasured is required'],
      min: 0,
    },
    opening: {
      type: String,
      required: [true, 'Opening is required'],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Client reference is required'],
    },
    coupling: {
      type: Number,
      required: [true, 'Coupling is required'],
      min: 0,
    },
    mounting: {
      type: Number,
      required: [true, 'Mounting is required'],
      min: 0,
    },
    externalCause: {
      type: Number,
      required: [true, 'External cause is required'],
      min: 0,
    },
    cavitation: {
      type: Number,
      required: [true, 'Cavitation is required'],
      min: 0,
    },
    bearing: {
      type: Number,
      required: [true, 'Bearing is required'],
      min: 0,
    },
    plainBearing: {
      type: Number,
      required: [true, 'Plain bearing is required'],
      min: 0,
    },
    belts: {
      type: Number,
      required: [true, 'Belts is required'],
      min: 0,
    },
    structuralDeficiency: {
      type: Number,
      required: [true, 'Structural deficiency is required'],
      min: 0,
    },
    misalignment: {
      type: Number,
      required: [true, 'Misalignment is required'],
      min: 0,
    },
    unbalance: {
      type: Number,
      required: [true, 'Unbalance is required'],
      min: 0,
    },
    componentWear: {
      type: Number,
      required: [true, 'Component wear is required'],
      min: 0,
    },
    shaft: {
      type: Number,
      required: [true, 'Shaft is required'],
      min: 0,
    },
    electrical: {
      type: Number,
      required: [true, 'Electrical is required'],
      min: 0,
    },
    gear: {
      type: Number,
      required: [true, 'Gear is required'],
      min: 0,
    },
    aerodynamicForces: {
      type: Number,
      required: [true, 'Aerodynamic forces is required'],
      min: 0,
    },
    hydraulicForces: {
      type: Number,
      required: [true, 'Hydraulic forces is required'],
      min: 0,
    },
    lubrication: {
      type: Number,
      required: [true, 'Lubrication is required'],
      min: 0,
    },
    operational: {
      type: Number,
      required: [true, 'Operational is required'],
      min: 0,
    },
    productLoss: {
      type: Number,
      required: [true, 'Product loss is required'],
      min: 0,
    },
    resonance: {
      type: Number,
      required: [true, 'Resonance is required'],
      min: 0,
    },
    friction: {
      type: Number,
      required: [true, 'Friction is required'],
      min: 0,
    },
    rollingBearing: {
      type: Number,
      required: [true, 'Rolling bearing is required'],
      min: 0,
    },
    sensorNoSignal: {
      type: Number,
      required: [true, 'Sensor no signal is required'],
      min: 0,
    },
    safety: {
      type: Number,
      required: [true, 'Safety is required'],
      min: 0,
    },
    noTechnicalInfo: {
      type: Number,
      required: [true, 'No technical info is required'],
      min: 0,
    },
    mechanicalLooseness: {
      type: Number,
      required: [true, 'Mechanical looseness is required'],
      min: 0,
    },
    powerTransmission: {
      type: Number,
      required: [true, 'Power transmission is required'],
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'measurements',
  }
);

// Index for common queries
measurementSchema.index({ clientId: 1, monthIndex: 1 });

const Measurement = model<IMeasurement>('Measurement', measurementSchema);

export default Measurement;
export type { IMeasurement };


