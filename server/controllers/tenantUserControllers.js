import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";

import { NotFoundError } from "../request-errors/index.js";

/**
 * @description Get Single Owner User
 * @route GET /api/tenant/owner-user/:slug
 * @returns {object} 200 - An object containing the owner user
 */
const getSingleOwnerUser = async (req, res) => {
  const { slug } = req.params;

  const user = await OwnerUser.findOne({ slug });

  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.json({ user });
};

/**
 * @description Get current user's details
 * @route GET /api/tenant/self
 * @returns {object} 200 - An object containing the user
 */
const getSelfDetail = async (req, res) => {
  const user = await TenantUser.findById(req.user.userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ user });
};

export { getSingleOwnerUser, getSelfDetail };
