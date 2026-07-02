import { Router } from "express";

import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";

import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
} from "../controllers/department.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createDepartment
);

router.get(
  "/",
  authenticate,
  getDepartments
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateDepartment
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteDepartment
);

export default router;