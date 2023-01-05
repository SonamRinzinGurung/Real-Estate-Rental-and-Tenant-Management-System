import express from "express";
const router = express.Router();
import {
  getAllProperties,
  getSingleProperty,
} from "../controllers/tenantPropertyControllers.js";

/**
 * @description Get all properties
 * @route GET /api/tenant/real-estate
 */
router.get("/", getAllProperties);

/**
 * @description Get single property
 * @route GET /api/tenant/real-estate/:id
 */
router.get("/:id", getSingleProperty);

export default router;
