import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";
import RealEstate from "../models/RealEstate.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Get Single Owner User
 * @route GET /api/tenant/owner-user/:slug
 * @returns {object} 200 - An object containing the owner user
 */
const getSingleOwnerUser = async (req, res) => {
  const { slug } = req.params;

  const user = await OwnerUser.findOne({ slug }).select("-contacts");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const realEstates = await RealEstate.find({ propertyOwner: user._id });

  res.json({ user, realEstates });
};

/**
 * @description Get current user's details
 * @route GET /api/tenant/profile
 * @returns {object} 200 - An object containing the user
 */
const getSelfDetail = async (req, res) => {
  const user = await TenantUser.findById(req.user.userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ user });
};

/**
 * @description Update current user's details
 * @route PATCH /api/tenant/profile
 * @returns {object} 200 - An object containing the user
 */
const updateProfile = async (req, res) => {
  const { phoneNumber, address, gender } = req.body;

  if (!address || !phoneNumber || !gender) {
    throw new BadRequestError("Please fill in all fields");
  }
  const user = await TenantUser.findByIdAndUpdate(
    req.user.userId,
    {
      gender,
      address,
      phoneNumber,
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({ user });
};

export { getSingleOwnerUser, getSelfDetail, updateProfile };
