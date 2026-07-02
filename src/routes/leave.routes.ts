import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";

import {
  applyLeave,
  getLeaves,
  updateLeaveStatus
} from "../controllers/leave.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  applyLeave
);

router.get(
  "/",
  authenticate,
  authorize("admin"),
  getLeaves
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateLeaveStatus
);

export default router;