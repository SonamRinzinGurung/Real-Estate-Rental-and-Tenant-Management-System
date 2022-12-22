import express from "express";
const router = express.Router();
import { addProperty } from "../controllers/ownerPropertyController.js";

router.post("/", addProperty);

export default router;
