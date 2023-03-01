import express from "express";
const router = express.Router();
import {
  getSingleRentDetailsTenantView,
  getAllPaymentHistory,
} from "../controllers/rentDetailTenantControllers.js";

/**
 * @description Get Single Rent Detail for tenant user
 * @route GET /api/rentDetailTenant/:realEstateId
 */
router.get("/:realEstateId", getSingleRentDetailsTenantView);

/**
 * @description Get All Payment History for tenant user
 * @route GET /api/rentDetailTenant/allPaymentHistory/:rentDetailId
 */
router.get("/allPaymentHistory/:rentDetailId", getAllPaymentHistory);
export default router;
