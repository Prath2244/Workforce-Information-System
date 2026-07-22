import { Router } from 'express';
import { authenticate, isHR } from '../middleware/auth';
import {
  createOrUpdatePayroll,
  getMyPayroll,
  getAllPayroll,
  deletePayroll,
  generatePayslipPDF
} from '../controllers/payrollController';

const router = Router();

router.post('/', authenticate, isHR, createOrUpdatePayroll);
router.get('/my', authenticate, getMyPayroll);
router.get('/all', authenticate, isHR, getAllPayroll);
router.delete('/:id', authenticate, isHR, deletePayroll);
router.get('/:id/pdf', authenticate, generatePayslipPDF); // <-- NEW

export default router;