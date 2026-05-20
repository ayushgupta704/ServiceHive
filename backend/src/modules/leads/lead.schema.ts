import { z } from 'zod';
import { LeadStatus, LeadSource } from '../../shared/enums/lead.enum.js';
import { LEAD_VALIDATION } from './leads.constants.js';

/**
 * Common Lead ID param validation
 */
export const leadIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Lead ID format'),
  }),
});

/**
 * Create Lead Schema
 */
export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .trim()
      .min(LEAD_VALIDATION.NAME_MIN, `Name must be at least ${LEAD_VALIDATION.NAME_MIN} characters`)
      .max(LEAD_VALIDATION.NAME_MAX, `Name cannot exceed ${LEAD_VALIDATION.NAME_MAX} characters`),
    email: z
      .string({ message: 'Email is required' })
      .trim()
      .email('Invalid email format')
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .max(LEAD_VALIDATION.PHONE_MAX, `Phone cannot exceed ${LEAD_VALIDATION.PHONE_MAX} characters`)
      .optional(),
    company: z
      .string()
      .trim()
      .max(LEAD_VALIDATION.COMPANY_MAX, `Company name cannot exceed ${LEAD_VALIDATION.COMPANY_MAX} characters`)
      .optional(),
    status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
    source: z.nativeEnum(LeadSource).default(LeadSource.WEBSITE),
    notes: z
      .string()
      .trim()
      .max(LEAD_VALIDATION.NOTES_MAX, `Notes cannot exceed ${LEAD_VALIDATION.NOTES_MAX} characters`)
      .optional(),
    assignedTo: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format for assignedTo')
      .optional(),
  }).strict(),
});

/**
 * Update Lead Schema
 */
export const updateLeadSchema = z.object({
  params: leadIdParamSchema.shape.params,
  body: z.object({
    name: z
      .string()
      .trim()
      .min(LEAD_VALIDATION.NAME_MIN, `Name must be at least ${LEAD_VALIDATION.NAME_MIN} characters`)
      .max(LEAD_VALIDATION.NAME_MAX, `Name cannot exceed ${LEAD_VALIDATION.NAME_MAX} characters`)
      .optional(),
    email: z
      .string()
      .trim()
      .email('Invalid email format')
      .toLowerCase()
      .optional(),
    phone: z
      .string()
      .trim()
      .max(LEAD_VALIDATION.PHONE_MAX, `Phone cannot exceed ${LEAD_VALIDATION.PHONE_MAX} characters`)
      .optional(),
    company: z
      .string()
      .trim()
      .max(LEAD_VALIDATION.COMPANY_MAX, `Company name cannot exceed ${LEAD_VALIDATION.COMPANY_MAX} characters`)
      .optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    notes: z
      .string()
      .trim()
      .max(LEAD_VALIDATION.NOTES_MAX, `Notes cannot exceed ${LEAD_VALIDATION.NOTES_MAX} characters`)
      .optional(),
    assignedTo: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format for assignedTo')
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

/**
 * Get Leads Query Schema
 */
export const getLeadsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().trim().optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    assignedTo: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid User ID format').optional(),
    sort: z.string().trim().optional(),
  }).strict(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>['body'];
export type GetLeadsQueryInput = z.infer<typeof getLeadsQuerySchema>['query'];
