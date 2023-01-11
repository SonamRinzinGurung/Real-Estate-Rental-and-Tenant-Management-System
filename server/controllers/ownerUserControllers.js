import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";

import { NotFoundError } from "../request-errors/index.js";

/**
 * @description Get Single Tenant User
 * @route GET /api/owner/tenant-user/:slug
 * @returns {object} 200 - An object containing the tenant user
 */
const getSingleTenantUser = async (req, res) => {
  const { slug } = req.params;

  const user = await TenantUser.findOne({ slug });

  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.json({ user });
};

/**
 * @description Get current user's details
 * @route GET /api/owner/self
 * @returns {object} 200 - An object containing the user
 */
const getSelfDetail = async (req, res) => {
  const user = await OwnerUser.findById(req.user.userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ user });
};

export { getSingleTenantUser, getSelfDetail };
