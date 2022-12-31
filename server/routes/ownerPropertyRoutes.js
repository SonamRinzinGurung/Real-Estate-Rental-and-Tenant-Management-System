import express from "express";
const router = express.Router();
import { postRealEstate } from "../controllers/ownerPropertyController.js";
import upload from "../middleware/multerImageMiddleware.js";
import { cloudinaryMultipleUpload } from "../middleware/cloudinaryUpload.js";

router.post(
  "/",
  upload.array("realEstateImages", 5),
  cloudinaryMultipleUpload,
  postRealEstate
);

export default router;
