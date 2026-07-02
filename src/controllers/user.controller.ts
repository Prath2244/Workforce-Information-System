import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const getProfile = (
  req: AuthRequest,
  res: Response
) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user
  });
};

export const getAdminDashboard = (
  req: AuthRequest,
  res: Response
) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
};