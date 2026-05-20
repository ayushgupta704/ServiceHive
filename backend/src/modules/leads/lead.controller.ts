import type { Request, Response } from 'express';
import { asyncHandler } from '../../core/utils/asyncHandler.js';
import { sendResponse } from '../../core/utils/sendResponse.js';
import { LEAD_MESSAGES } from './leads.constants.js';
import leadService from './lead.service.js';
import type { CreateLeadInput, UpdateLeadInput, GetLeadsQueryInput } from './lead.schema.js';
import type { AuthenticatedUser } from '../auth/auth.interface.js';

/**
 * @desc    Create new lead
 * @route   POST /api/v1/leads
 * @access  Private (Admin, Sales User)
 */
export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const leadData = req.body as CreateLeadInput;
  const currentUser = req.user as AuthenticatedUser;

  const lead = await leadService.createLead(leadData, currentUser);

  return sendResponse(res, 201, LEAD_MESSAGES.CREATE_SUCCESS, lead);
});

/**
 * @desc    Get all leads with filtering, search, and pagination
 * @route   GET /api/v1/leads
 * @access  Private (Admin, Sales User)
 */
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const queryOptions = req.query as unknown as GetLeadsQueryInput;
  const currentUser = req.user as AuthenticatedUser;

  const result = await leadService.getLeads(queryOptions, currentUser);

  return sendResponse(res, 200, LEAD_MESSAGES.FETCH_SUCCESS, result.data, result.meta);
});

/**
 * @desc    Get single lead by ID
 * @route   GET /api/v1/leads/:id
 * @access  Private (Admin, Sales User - Ownership enforced)
 */
export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const currentUser = req.user as AuthenticatedUser;

  const lead = await leadService.getLeadById(id, currentUser);

  return sendResponse(res, 200, 'Lead retrieved successfully', lead);
});

/**
 * @desc    Update lead
 * @route   PATCH /api/v1/leads/:id
 * @access  Private (Admin, Sales User - Ownership enforced)
 */
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updateData = req.body as UpdateLeadInput;
  const currentUser = req.user as AuthenticatedUser;

  const lead = await leadService.updateLead(id, updateData, currentUser);

  return sendResponse(res, 200, LEAD_MESSAGES.UPDATE_SUCCESS, lead);
});

/**
 * @desc    Delete lead
 * @route   DELETE /api/v1/leads/:id
 * @access  Private (Admin, Sales User - Ownership enforced)
 */
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const currentUser = req.user as AuthenticatedUser;

  await leadService.deleteLead(id, currentUser);

  return sendResponse(res, 200, LEAD_MESSAGES.DELETE_SUCCESS);
});

/**
 * @desc    Export leads to CSV
 * @route   GET /api/v1/leads/export/csv
 * @access  Private (Admin, Sales User)
 */
export const exportLeadsToCSV = asyncHandler(async (req: Request, res: Response) => {
  const queryOptions = req.query as unknown as GetLeadsQueryInput;
  const currentUser = req.user as AuthenticatedUser;

  await leadService.exportLeads(queryOptions, currentUser, res);
});
