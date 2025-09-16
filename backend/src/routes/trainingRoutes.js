import { Router } from 'express';
import {
  getTrainings,
  addTraining,
  updateTraining,
  deleteTraining
} from '../controllers/trainingController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getTrainings);
router.post('/:userId', authorize('Admin'), addTraining);
router.put('/:userId/:trainingId', authorize('Admin'), updateTraining);
router.delete('/:userId/:trainingId', authorize('Admin'), deleteTraining);

export default router;
