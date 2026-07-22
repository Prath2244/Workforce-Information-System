import { Router } from 'express';
import { authenticate, isHR } from '../middleware/auth';
import {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController';

const router = Router();

router.post('/', authenticate, createLeave);
router.get('/my', authenticate, getMyLeaves);
router.get('/all', authenticate, isHR, getAllLeaves);
router.put('/:id', authenticate, isHR, updateLeaveStatus);

export default router;