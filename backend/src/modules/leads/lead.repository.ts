import mongoose from 'mongoose';
import Lead from './lead.model.js';
import type { ILeadDocument } from './lead.model.js';
import type {
  CreateLeadDto,
  UpdateLeadDto,
  LeadQueryOptions,
  PaginatedLeadResponse,
  PaginationMeta,
} from './lead.interface.js';

class LeadRepository {
  /**
   * Create a new lead
   */
  async createLead(leadData: CreateLeadDto): Promise<ILeadDocument> {
    return Lead.create(leadData);
  }

  /**
   * Find lead by ID
   */
  async findById(id: string, useLean = false): Promise<ILeadDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    
    const query = Lead.findById(id);
    return useLean ? query.lean().exec() : query.exec();
  }

  /**
   * Update lead details
   */
  async updateLead(id: string, updateData: UpdateLeadDto): Promise<ILeadDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    return Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /**
   * Delete lead
   */
  async deleteLead(id: string): Promise<ILeadDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Lead.findByIdAndDelete(id).exec();
  }

  /**
   * Check if lead exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const lead = await Lead.findOne({ email }).select('_id').lean().exec();
    return !!lead;
  }

  /**
   * Get paginated leads with filtering, search, and sorting
   * This is the heart of the dashboard's data retrieval.
   */
  async getLeads(options: LeadQueryOptions): Promise<PaginatedLeadResponse<ILeadDocument>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      source,
      assignedTo,
      sort = '-createdAt',
    } = options;

    // 1. Build dynamic filter object
    const query: Record<string, unknown> = {};

    // RBAC and User filtering
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // Status & Source filtering
    if (status) query.status = status;
    if (source) query.source = source;

    // 2. Implement Text Search
    // Uses the 'LeadSearchIndex' defined in the model
    if (search) {
      query.$text = { $search: search };
    }

    // 3. Execution & Pagination
    const skip = (page - 1) * limit;
    
    // Cap limit to prevent large memory spikes
    const safeLimit = Math.min(limit, 100);

    // Use lean() for read-heavy list queries to avoid Mongoose document hydration overhead
    const dataQuery = Lead.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : sort)
      .skip(skip)
      .limit(safeLimit)
      .lean();

    // If text search is used, include the score for sorting relevance
    if (search) {
      dataQuery.select({ score: { $meta: 'textScore' } });
    }

    // Run data query and count query in parallel for better performance
    const [data, total] = await Promise.all([
      dataQuery.exec() as Promise<ILeadDocument[]>,
      Lead.countDocuments(query),
    ]);

    // 4. Build Pagination Metadata
    const totalPages = Math.ceil(total / safeLimit);
    const meta: PaginationMeta = {
      total,
      page,
      limit: safeLimit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return { data, meta };
  }

  /**
   * Get a Mongoose cursor for leads (for memory-efficient streaming)
   */
  async getLeadsCursor(options: LeadQueryOptions): Promise<mongoose.Cursor<ILeadDocument, mongoose.QueryOptions<ILeadDocument>>> {
    const { search, status, source, assignedTo, sort = '-createdAt' } = options;

    const query: Record<string, unknown> = {};

    if (assignedTo) query.assignedTo = assignedTo;
    if (status) query.status = status;
    if (source) query.source = source;

    if (search) {
      query.$text = { $search: search };
    }

    return Lead.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : sort)
      .populate('assignedTo', 'name')
      .lean()
      .cursor();
  }

  /**
   * Separate optimized count query
   */
  async countLeads(filter: Record<string, unknown>): Promise<number> {
    return Lead.countDocuments(filter).exec();
  }
}

export default new LeadRepository();