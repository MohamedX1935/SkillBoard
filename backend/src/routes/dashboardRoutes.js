import { Router } from 'express';
import { getMetrics, exportReport } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/metrics', getMetrics);
router.get('/report', exportReport);

export default router;
