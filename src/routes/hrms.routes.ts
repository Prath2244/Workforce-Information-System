import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";

import { getEmployeeDetails } from "../controllers/hrms.controller";

const router = Router();

router.get(
  "/employee-details",
  authenticate,
  authorize("admin"),
  getEmployeeDetails
);

export default router;