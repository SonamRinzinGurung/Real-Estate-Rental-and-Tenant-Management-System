import express from "express";
const router = express.Router();
import {
  createLease,
  signLease,
  getLeaseDetailOwnerView,
  deleteLease,
  getOwnerAllLeases,
  getAllTenantRentalProperties,
  getTenantLeaseDetail,
  terminateLease,
  terminateLeaseApprove,
  leaseUpdateForm,
  updateLeaseUnsigned,
} from "../controllers/leaseControllers.js";
import {
  authorizeOwnerUser,
  authorizeTenantUser,
} from "../middleware/userAuthorization.js";
import upload from "../middleware/multerImageMiddleware.js";


/**
 * @description Create a lease
 * @route POST /api/lease
 */
router.post("/", authorizeOwnerUser, createLease);

/**
 * @description Sign lease as tenant user to approve the lease
 * @route PATCH /api/lease/sign/:leaseId
 */
router.patch("/sign/:leaseId", authorizeTenantUser, signLease);

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

/**
 * @description Update lease form details for the tenant user
 * @route PATCH /api/lease/tenant/updateLeaseForm/:leaseId
 */
router.patch("/tenant/updateLeaseForm/:leaseId", authorizeTenantUser, upload.fields([{ name: "photoId", maxCount: 1, }, {
  name: "proofOfIncome", maxCount: 3
}]), leaseUpdateForm);

/**
 * @description Update lease status to "Unsigned"
 * @route PATCH /api/lease/owner/updateLeaseUnsigned/:leaseId
 */
router.patch("/owner/updateLeaseUnsigned/:leaseId", authorizeOwnerUser, updateLeaseUnsigned);



export default router;
