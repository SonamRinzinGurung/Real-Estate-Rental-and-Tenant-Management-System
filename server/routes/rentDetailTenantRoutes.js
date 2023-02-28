import express from "express";
const router = express.Router();
import { getSingleRentDetailsTenantView } from "../controllers/rentDetailTenantControllers.js";

/**
 * @description Get Single Rent Detail for tenant user
 * @route GET /api/rentDetailTenant/:realEstateId
 */
router.get("/:realEstateId", getSingleRentDetailsTenantView);

export default router;
