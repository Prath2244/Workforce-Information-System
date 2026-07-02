import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";

import {
  getProfile,
  getAdminDashboard
} from "../controllers/user.controller";

const router = Router();

router.get(
  "/profile",
  authenticate,
  getProfile
);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  getAdminDashboard
);

export default router;