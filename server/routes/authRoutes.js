import express from "express";
const router = express.Router();
import {
  login,
  register,
  refreshOwner,
  refreshTenant,
  logout,
} from "../controllers/authController.js";
import upload from "../middleware/multerImageMiddleware.js";
import { cloudinaryProfileImageUpload } from "../middleware/cloudinaryUpload.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

/**
 * @description generate new access token for owner user
 * @route POST /api/auth/owner/refresh
 */
router.get("/owner/refresh", refreshOwner);

/**
 * @description generate new access token for tenant user
 * @route POST /api/auth/tenant/refresh
 */
router.get("/tenant/refresh", refreshTenant);

/**
 * @description login user
 * @route POST /api/auth/login
 */
router.post("/login", apiLimiter, login);

/**
 * @description register new user
 * @route POST /api/auth/register
 */
router.post(
  "/register",
  apiLimiter,
  upload.single("profileImage"),
  cloudinaryProfileImageUpload,
  register
);

/**
 * @description logout user
 * @route POST /api/auth/logout
 */
router.post("/logout", logout);

export default router;
