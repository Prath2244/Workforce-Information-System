import { Router } from 'express';
import { authenticate, isHR, isAdmin } from '../middleware/auth';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController';

const router = Router();

// GET /employees – any authenticated user can view (employees see basic info via frontend logic)
router.get('/', authenticate, getEmployees);
router.get('/:id', authenticate, getEmployee);

// POST, PUT, DELETE – only HR/Admin
router.post('/', authenticate, isHR, createEmployee);
router.put('/:id', authenticate, isHR, updateEmployee);
router.delete('/:id', authenticate, isAdmin, deleteEmployee);

export default router;