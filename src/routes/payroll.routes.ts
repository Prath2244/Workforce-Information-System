import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";

import {
  createPayroll,
  getPayrolls
} from "../controllers/payroll.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createPayroll
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  getPayrolls
);

export default router;