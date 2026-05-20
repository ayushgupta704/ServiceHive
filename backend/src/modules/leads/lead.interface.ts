import mongoose from 'mongoose';
import { LeadStatus, LeadSource } from '../../shared/enums/lead.enum.js';

export interface ILead {
  _id?: string | mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: mongoose.Types.ObjectId;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// DTOs
export interface CreateLeadDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  source: LeadSource;
  assignedTo?: string; // ID as string from controller
  notes?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

// Query Interfaces
export interface LeadQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  assignedTo?: string;
  sort?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedLeadResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ILeadMethods {
  // Add instance methods here if needed in the future
}
