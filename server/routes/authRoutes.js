import express from "express";
const router = express.Router();
import { login, register } from "../controllers/authController.js";
import upload from "../middleware/multerImageMiddleware.js";
import { cloudinaryProfileImageUpload } from "../middleware/cloudinaryUpload.js";
import rateLimiter from "express-rate-limit";

// rate limiter for login and register routes
const apiLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    "Request Limit reached for this IP Address. Please wait for 60 seconds and try again",
});

/**
 * @route POST /api/auth/login
 */
router.post("/login", apiLimiter, login);

/**
 * @route POST /api/auth/register
 */
router.post(
  "/register",
  apiLimiter,
  upload.single("profileImage"),
  cloudinaryProfileImageUpload,
  register
);

export default router;
