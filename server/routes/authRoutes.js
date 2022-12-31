import express from "express";
const router = express.Router();
import { login, register } from "../controllers/authController.js";
import upload from "../middleware/multerImageMiddleware.js";
import { cloudinaryProfileImageUpload } from "../middleware/cloudinaryUpload.js";

router.post("/login", login);
router.post(
  "/register",
  upload.single("profileImage"),
  cloudinaryProfileImageUpload,
  register
);

export default router;
