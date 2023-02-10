import express from "express";
const router = express.Router();
import { createRentDetail } from "../controllers/rentDetailControllers.js";
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

/**
 * @description Create rent payment detail
 * @route POST /api/rentPayment
 */
router.post("/createDetail", authorizeOwnerUser, createRentDetail);

export default router;
