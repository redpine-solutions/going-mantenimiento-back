import { type Document, model, Schema, Types } from 'mongoose';

interface IMeasurement extends Document {
  date: Date;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  clientId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const measurementSchema = new Schema<IMeasurement>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
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
measurementSchema.index({ clientId: 1, date: -1 });

const Measurement = model<IMeasurement>('Measurement', measurementSchema);

export default Measurement;
export type { IMeasurement };


