import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

const authorize =
  (...roles: string[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Forbidden"
      });
    }

    next();
  };

export default authorize;