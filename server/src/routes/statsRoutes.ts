import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getDepartmentStats, getPendingLeaves } from '../controllers/statsController';

const router = Router();

// Any authenticated user can view stats (admin, hr, employee)
router.get('/departments', authenticate, getDepartmentStats);
router.get('/pending-leaves', authenticate, getPendingLeaves);

export default router;