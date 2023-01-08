import express from "express";
const router = express.Router();
import {
  postRealEstate,
  getOwnerRealEstates,
  getSingleProperty,
} from "../controllers/ownerPropertyController.js";
import upload from "../middleware/multerImageMiddleware.js";
import { cloudinaryMultipleUpload } from "../middleware/cloudinaryUpload.js";

/**
 * @description Post real estate
 * @route POST /api/owner/real-estate
 */
router.post(
  "/",
  upload.array("realEstateImages", 10),
  cloudinaryMultipleUpload,
  postRealEstate
);

/**
 * @description Get Owner's personal real estates
 * @route GET /api/owner/real-estate
 */
router.get("/", getOwnerRealEstates);

/**
 * @description Get single property
 * @route GET /api/owner/real-estate/:id
 */
router.get("/:id", getSingleProperty);

export default router;
