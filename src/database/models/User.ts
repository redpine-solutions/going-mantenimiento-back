import bcrypt from 'bcryptjs';
import { type Document, model, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'client';
  clientId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'client'],
        message: 'Role must be either admin or client',
      },
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Add indexes
userSchema.index({ username: 1 });

// Pre-save hook to hash password
userSchema.pre('save', async function (next): Promise<void> {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

const User = model<IUser>('User', userSchema);

export default User;
export type { IUser };
