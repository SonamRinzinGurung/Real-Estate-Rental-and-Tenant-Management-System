import express from "express";
const router = express.Router();
import { postRealEstate } from "../controllers/ownerPropertyController.js";
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

export default router;
