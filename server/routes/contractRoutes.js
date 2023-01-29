import express from "express";
const router = express.Router();
import {
  createContract,
  getContractDetailTenantView,
} from "../controllers/contractControllers.js";
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";
/**
 * @description Create a contract
 * @route POST /api/contract
 */
router.post("/", authorizeOwnerUser, createContract);

/**
 * @description Get the contract details for the tenant user
 * @route GET /api/contract/tenantView/:contractId
 */
router.get(
  "/tenantView/:contractId",
  authorizeTenantUser,
  getContractDetailTenantView
);

export default router;
