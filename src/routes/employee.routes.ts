import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from "../controllers/employee.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createEmployee
);

router.get(
  "/",
  authenticate,
  getEmployees
);

router.get(
  "/:id",
  authenticate,
  getEmployeeById
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateEmployee
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteEmployee
);

export default router;