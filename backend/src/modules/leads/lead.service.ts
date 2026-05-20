import { AppError } from '../../core/errors/AppError.js';
import { UserRole } from '../../shared/enums/user.enum.js';
import leadRepository from './lead.repository.js';
import csvService from './csv.service.js';
import type { Response } from 'express';
import type {
  CreateLeadDto,
  UpdateLeadDto,
  LeadQueryOptions,
  PaginatedLeadResponse,
} from './lead.interface.js';
import type { ILeadDocument } from './lead.model.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

class LeadService {
  private readonly SORT_WHITELIST = ['createdAt', '-createdAt', 'name', '-name', 'status', '-status'];
  private readonly ALLOWED_UPDATE_FIELDS: (keyof UpdateLeadDto)[] = [
    'name',
    'email',
    'phone',
    'company',
    'status',
    'source',
    'notes',
    'assignedTo',
  ];

  /**
   * Create a new lead
   * - Enforces RBAC for assignment
   * - Prevents duplicate emails
   */
  async createLead(leadData: CreateLeadDto, currentUser: AuthenticatedUser): Promise<ILeadDocument> {
    // 1. Duplicate check
    const emailExists = await leadRepository.existsByEmail(leadData.email);
    if (emailExists) {
      throw new AppError('A lead with this email already exists', 409);
    }

    // 2. RBAC: Sales users always own their leads, Admins can assign freely
    const assignedTo = currentUser.role === UserRole.ADMIN ? leadData.assignedTo : currentUser.id;

    const newLeadData: CreateLeadDto = {
      ...leadData,
      assignedTo,
    };

    return leadRepository.createLead(newLeadData);
  }

  /**
   * Get leads list with RBAC, filtering, and sanitization
   */
  async getLeads(
    options: LeadQueryOptions,
    currentUser: AuthenticatedUser,
  ): Promise<PaginatedLeadResponse<ILeadDocument>> {
    const sanitizedOptions: LeadQueryOptions = {
      page: Math.max(1, Number(options.page) || 1),
      limit: Math.min(100, Math.max(1, Number(options.limit) || 10)),
      search: options.search?.trim(),
      status: options.status,
      source: options.source,
      sort: this.SORT_WHITELIST.includes(options.sort || '') ? options.sort : '-createdAt',
    };

    // RBAC: Sales users only see their own data
    if (currentUser.role === UserRole.SALES_USER) {
      sanitizedOptions.assignedTo = currentUser.id;
    } else if (options.assignedTo) {
      // Admins can filter by specific user if provided
      sanitizedOptions.assignedTo = options.assignedTo;
    }

    return leadRepository.getLeads(sanitizedOptions);
  }

  /**
   * Get single lead with IDOR protection
   */
  async getLeadById(id: string, currentUser: AuthenticatedUser): Promise<ILeadDocument> {
    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // RBAC Ownership Check
    this.verifyOwnership(lead, currentUser);

    return lead;
  }

  /**
   * Update lead with security whitelisting and ownership check
   */
  async updateLead(
    id: string,
    updateData: UpdateLeadDto,
    currentUser: AuthenticatedUser,
  ): Promise<ILeadDocument> {
    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // 1. RBAC Ownership Check
    this.verifyOwnership(lead, currentUser);

    // 2. Duplicate check if email is changing
    if (updateData.email && updateData.email !== lead.email) {
      const emailExists = await leadRepository.existsByEmail(updateData.email);
      if (emailExists) {
        throw new AppError('A lead with this email already exists', 409);
      }
    }

    // 3. Whitelist allowed fields to prevent privilege escalation or data corruption
    const filteredUpdate: Record<string, unknown> = {};
    for (const key of this.ALLOWED_UPDATE_FIELDS) {
      if (updateData[key] !== undefined) {
        // Sales users cannot reassign leads
        if (key === 'assignedTo' && currentUser.role !== UserRole.ADMIN) {
          continue;
        }
        
        filteredUpdate[key as string] = updateData[key];
      }
    }

    const updatedLead = await leadRepository.updateLead(id, filteredUpdate as UpdateLeadDto);
    
    if (!updatedLead) {
      throw new AppError('Failed to update lead', 500);
    }

    return updatedLead;
  }

  /**
   * Delete lead with ownership check
   */
  async deleteLead(id: string, currentUser: AuthenticatedUser): Promise<void> {
    // Only Admin can delete or Sales User can delete their own
    const lead = await leadRepository.findById(id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    this.verifyOwnership(lead, currentUser);

    await leadRepository.deleteLead(id);
  }

  /**
   * Export leads to CSV with RBAC and filtering
   */
  async exportLeads(
    options: LeadQueryOptions,
    currentUser: AuthenticatedUser,
    res: Response,
  ): Promise<void> {
    const sanitizedOptions: LeadQueryOptions = {
      search: options.search?.trim(),
      status: options.status,
      source: options.source,
      sort: this.SORT_WHITELIST.includes(options.sort || '') ? options.sort : '-createdAt',
    };

    // RBAC
    if (currentUser.role === UserRole.SALES_USER) {
      sanitizedOptions.assignedTo = currentUser.id;
    } else if (options.assignedTo) {
      sanitizedOptions.assignedTo = options.assignedTo;
    }

    const cursor = await leadRepository.getLeadsCursor(sanitizedOptions);
    await csvService.streamLeadsToCsv(cursor, res);
  }

  /**
   * Internal Helper: verifyOwnership (IDOR Protection)
   */
  private verifyOwnership(lead: ILeadDocument, user: AuthenticatedUser): void {
    if (user.role === UserRole.ADMIN) return;

    if (lead.assignedTo.toString() !== user.id) {
      throw new AppError('Forbidden: You do not have permission to access this lead', 403);
    }
  }
}

export default new LeadService();
