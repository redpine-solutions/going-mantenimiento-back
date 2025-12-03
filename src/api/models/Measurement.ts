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


