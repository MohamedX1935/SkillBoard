import { Router } from 'express';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getSkills);
router.post('/:userId', authorize('Admin'), addSkill);
router.put('/:userId/:skillId', authorize('Admin'), updateSkill);
router.delete('/:userId/:skillId', authorize('Admin'), deleteSkill);

export default router;
