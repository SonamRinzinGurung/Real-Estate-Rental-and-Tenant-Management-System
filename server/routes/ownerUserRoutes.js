import express from "express";
const router = express.Router();
import {
  getSingleTenantUser,
  getSelfDetail,
} from "../controllers/ownerUserControllers.js";

/**
 * @description Get Single Tenant User
 * @route GET /api/owner/tenant-user/:slug
 */
router.get("/tenant-user/:slug", getSingleTenantUser); // Only the tenant user can access this route

/**
 * @description Get the current user's details
 * @route GET /api/owner/profile
 */
router.get("/profile", getSelfDetail);

export default router;
