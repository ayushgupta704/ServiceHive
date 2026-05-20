import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { LeadStatus, LeadSource } from '../../shared/enums/lead.enum.js';
import type { ILead, ILeadMethods } from './lead.interface.js';

export interface ILeadDocument extends Document, Omit<ILead, '_id'>, ILeadMethods {
  _id: mongoose.Types.ObjectId;
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(LeadStatus),
        message: '{VALUE} is not a valid lead status',
      },
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: {
        values: Object.values(LeadSource),
        message: '{VALUE} is not a valid lead source',
      },
      required: [true, 'Lead source is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must be assigned to a user'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

/**
 * INDEXING STRATEGY
 */

// 1. Single Field Indexes
// Optimized for direct lookups and filtering
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ assignedTo: 1 });

// 2. Compound Index
// Optimized for RBAC dashboard views (Sales users filtering their own leads by status)
leadSchema.index({ assignedTo: 1, status: 1 });

// 3. Text Index
// Optimized for global search feature across name, email, and company
leadSchema.index(
  { name: 'text', email: 'text', company: 'text' },
  { weights: { name: 10, email: 5, company: 2 }, name: 'LeadSearchIndex' },
);

const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;
