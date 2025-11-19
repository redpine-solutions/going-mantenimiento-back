import { type Document, model, Schema } from 'mongoose';

interface IClient extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'clients',
  }
);

// Add indexes
clientSchema.index({ name: 1 });

const Client = model<IClient>('Client', clientSchema);

export default Client;
export type { IClient };
