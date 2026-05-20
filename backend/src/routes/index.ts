import { Router } from 'express';
import type { Request, Response } from 'express';
import { sendResponse } from '../core/utils/sendResponse.js';
import authRoutes from '../modules/auth/auth.route.js';
import leadRoutes from '../modules/leads/lead.route.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  sendResponse(res, 200, 'API is running smoothly', {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
