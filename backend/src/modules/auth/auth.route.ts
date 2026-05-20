import { Router } from 'express';
import { register, login, getMe, logout, refresh } from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from './auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
