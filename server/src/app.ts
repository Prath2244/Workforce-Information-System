import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);

// Default Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Enterprise HRMS API Running",
  });
});

export default app;