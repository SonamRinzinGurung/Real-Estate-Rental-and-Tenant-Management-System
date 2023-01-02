import express from "express";
const router = express.Router();
import { viewProperties } from "../controllers/tenantPropertyControllers.js";

/**
 * @route GET /api/tenant/real-estate
 */
router.get("/", viewProperties);

export default router;
