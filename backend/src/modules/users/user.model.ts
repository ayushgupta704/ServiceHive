import mongoose, { Schema, type Document, type Model, type CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../shared/enums/user.enum.js';
import type { IUser, IUserMethods } from './user.interface.js';

export interface IUserDocument extends Document, Omit<IUser, '_id'>, IUserMethods {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SALES_USER,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);

export default User;
