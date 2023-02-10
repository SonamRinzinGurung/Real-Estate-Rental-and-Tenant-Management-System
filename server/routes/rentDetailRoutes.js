import express from "express";
const router = express.Router();
import {
  createRentDetail,
  getAllRentDetailsOwnerView,
} from "../controllers/rentDetailControllers.js";
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";

/**
 * @description Create rent payment detail
 * @route POST /api/rentDetail/createDetail
 */
router.post("/createDetail", authorizeOwnerUser, createRentDetail);

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 */
router.get("/allRentDetails", authorizeOwnerUser, getAllRentDetailsOwnerView);
export default router;
