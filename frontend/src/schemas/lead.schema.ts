import { z } from 'zod';

export const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
export const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  company: z.string().trim().max(100).optional().or(z.literal('')),
  status: leadStatusEnum.default('New'),
  source: leadSourceEnum,
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial();
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
