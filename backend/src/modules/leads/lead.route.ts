import { Router } from 'express';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { UserRole } from '../../shared/enums/user.enum.js';
import * as leadController from './lead.controller.js';
import {
  createLeadSchema,
  updateLeadSchema,
  getLeadsQuerySchema,
  leadIdParamSchema,
} from './lead.schema.js';

const router = Router();

// Apply protection to all lead routes
router.use(protect);

// Routes accessible by both Admin and Sales User
// (Business logic in Service layer handles specific record-level RBAC/Ownership)
router
  .route('/')
  .post(
    authorize(UserRole.ADMIN, UserRole.SALES_USER),
    validate(createLeadSchema),
    leadController.createLead,
  )
  .get(
    authorize(UserRole.ADMIN, UserRole.SALES_USER),
    validate(getLeadsQuerySchema),
    leadController.getLeads,
  );

router.get(
  '/export/csv',
  authorize(UserRole.ADMIN, UserRole.SALES_USER),
  validate(getLeadsQuerySchema),
  leadController.exportLeadsToCSV,
);

router
  .route('/:id')
  .get(
    authorize(UserRole.ADMIN, UserRole.SALES_USER),
    validate(leadIdParamSchema),
    leadController.getLeadById,
  )
  .patch(
    authorize(UserRole.ADMIN, UserRole.SALES_USER),
    validate(updateLeadSchema),
    leadController.updateLead,
  )
  .delete(
    authorize(UserRole.ADMIN, UserRole.SALES_USER),
    validate(leadIdParamSchema),
    leadController.deleteLead,
  );

export default router;
