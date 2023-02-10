import express from "express";
const router = express.Router();
import {
  createContract,
  getContractDetailTenantView,
  approveContract,
  getContractDetailOwnerView,
  deleteContract,
  getOwnerAllContracts,
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

/**
 * @description Approve the contract
 * @route PATCH /api/contract/approve/:contractId
 */
router.patch("/approve/:contractId", authorizeTenantUser, approveContract);

/**
 * @description Get the contract details for the owner user
 * @route GET /api/contract/ownerView/:realEstateId
 */
router.get(
  "/ownerView/:realEstateId",
  authorizeOwnerUser,
  getContractDetailOwnerView
);

/**
 * @description Delete a contract
 * @route DELETE /api/contract/delete/:contractId
 */
router.delete("/delete/:contractId", authorizeOwnerUser, deleteContract);

/**
 * @description Get All Owner's Contracts
 * @route GET /api/contract/owner/allContracts
 */
router.get("/owner/allContracts", authorizeOwnerUser, getOwnerAllContracts);

export default router;
