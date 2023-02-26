import express from "express";
const router = express.Router();
import {
  createRentDetail,
  getAllRentDetailsOwnerView,
  getSingleRentDetailsOwnerView,
  createPaymentHistory,
  getAllPaymentHistory,
} from "../controllers/rentDetailOwnerControllers.js";

/**
 * @description Create rent payment detail
 * @route POST /api/rentDetail/createDetail
 */
router.post("/createDetail", createRentDetail);

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 */
router.get("/allRentDetails", getAllRentDetailsOwnerView);

/**
 * @description Get Single Rent Detail for owner user
 * @route GET /api/rentDetail/:rentDetailId
 */
router.get("/:rentDetailId", getSingleRentDetailsOwnerView);

/**
 * @description Create rent payment detail history
 * @route POST /api/rentDetail/createPaymentHistory
 */
router.post("/createPaymentHistory", createPaymentHistory);

/**
 * @description Get All Payment History for owner user
 * @route GET /api/rentDetail/allPaymentHistory/:rentDetailId
 */
router.get("/allPaymentHistory/:rentDetailId", getAllPaymentHistory);

export default router;
