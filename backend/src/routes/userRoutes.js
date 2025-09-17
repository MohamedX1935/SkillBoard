import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(getUsers)
  .post(authorize('Admin'), createUser);

router
  .route('/:id')
  .get(getUser)
  .put(authorize('Admin'), updateUser)
  .delete(authorize('Admin'), deleteUser);

export default router;
