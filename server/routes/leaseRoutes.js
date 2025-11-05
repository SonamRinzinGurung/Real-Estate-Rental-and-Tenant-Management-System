import express from "express";
const router = express.Router();
import {
  createLease,
  approveLease,
  getLeaseDetailOwnerView,
  deleteLease,
  getOwnerAllLeases,
  getAllTenantRentalProperties,
  getTenantLeaseDetail,
  terminateLease,
  terminateLeaseApprove
} from "../controllers/leaseControllers.js";
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";
/**
 * @description Create a lease
 * @route POST /api/lease
 */
router.post("/", authorizeOwnerUser, createLease);

/**
 * @description Approve the lease
 * @route PATCH /api/lease/approve/:leaseId
 */
router.patch("/approve/:leaseId", authorizeTenantUser, approveLease);

/**
 * @description Get the lease details for the owner user
 * @route GET /api/lease/ownerView/:realEstateId
 */
router.get(
  "/ownerView/:realEstateId",
  authorizeOwnerUser,
  getLeaseDetailOwnerView
);


/**
 * @description Terminate the lease set status to "Terminated-pending"
 * @route PATCH /api/lease/terminate/:leaseId
 */
router.patch("/terminate/:leaseId", authorizeOwnerUser, terminateLease);

/**
 * @description Terminate the lease set status to "Terminated-approved"
 * @route PATCH /api/lease/terminate-approve/:leaseId
 */
router.patch("/terminate-approve/:leaseId", authorizeTenantUser, terminateLeaseApprove);

/**
 * @description Delete a lease
 * @route DELETE /api/lease/delete/:leaseId
 */
router.delete("/delete/:leaseId", authorizeOwnerUser, deleteLease);

/**
 * @description Get All Owner's Leases
 * @route GET /api/lease/owner/allLeases
 */
router.get("/owner/allLeases", authorizeOwnerUser, getOwnerAllLeases);

/**
 * @description Get the active rental properties of the tenant user
 * @route GET /api/lease/tenantUser/allRentalProperties
 */
router.get(
  "/tenantUser/allRentalProperties",
  authorizeTenantUser,
  getAllTenantRentalProperties
);

/**
 * @description Get the lease details for the tenant user using the real estate id
 * @route GET /api/lease/tenant/:realEstateId
 */
router.get(
  "/tenant/:realEstateId",
  authorizeTenantUser,
  getTenantLeaseDetail
);

export default router;
