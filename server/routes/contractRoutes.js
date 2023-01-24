import express from "express";
const router = express.Router();
import { createContract } from "../controllers/contractControllers.js";
import { authorizeOwnerUser } from "../middleware/userAuthorization.js";
/**
 * @description Create a contract
 * @route POST /api/contract
 */
router.post("/", authorizeOwnerUser, createContract);

export default router;
