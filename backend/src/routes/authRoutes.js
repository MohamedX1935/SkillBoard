import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', authenticate, authorize('Admin'), register);

export default router;
