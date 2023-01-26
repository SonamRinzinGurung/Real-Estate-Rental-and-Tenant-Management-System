import express from "express";
const router = express.Router();
import {
  getSingleTenantUser,
  getSelfDetail,
  updateProfile,
  addContactToggle,
  getAllContacts,
} from "../controllers/ownerUserControllers.js";

/**
 * @description Get Single Tenant User
 * @route GET /api/owner/tenant-user/:slug
 */
router.get("/tenant-user/:slug", getSingleTenantUser); // Only the tenant user can access this route

/**
 * @description Get the current user's details
 * @route GET /api/owner/profile
 */
router.get("/profile", getSelfDetail);

/**
 * @description Update the current user's details
 * @route PATCH /api/owner/profile
 */
router.patch("/profile", updateProfile);

/**
 * @description Toggle Add Contact (Add or Remove Contact)
 * @route PATCH /api/owner/addContact/:id
 */
router.patch("/addContact/:id", addContactToggle);

/**
 * @description Get All Contacts
 * @route PATCH /api/owner/contacts/all
 */
router.get("/contacts/all", getAllContacts);

export default router;
