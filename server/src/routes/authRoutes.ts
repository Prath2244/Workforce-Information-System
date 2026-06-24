import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route (Admin Only)
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

// Protected Route (Employee & Admin)
router.get(
  "/profile",
  authenticate,
  authorize("employee", "admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Profile Access Granted",
    });
  }
);

export default router;