import express from "express";
const router = express.Router();
import {
  getSingleOwnerUser,
  getSelfDetail,
} from "../controllers/tenantUserControllers.js";

/**
 * @description Get Single Property Owner User
 * @route GET /api/tenant/owner-user/:slug
 */
router.get("/owner-user/:slug", getSingleOwnerUser);

/**
 * @description Get the current user's details
 * @route GET /api/tenant/self
 */
router.get("/self", getSelfDetail);

export default router;
