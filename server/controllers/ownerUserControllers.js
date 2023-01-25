import OwnerUser from "../models/OwnerUser.js";
import TenantUser from "../models/TenantUser.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Get Single Tenant User
 * @route GET /api/owner/tenant-user/:slug
 * @returns {object} 200 - An object containing the tenant user
 */
const getSingleTenantUser = async (req, res) => {
  const { slug } = req.params;
  const { userId } = req.user;

  const user = await TenantUser.findOne({ slug });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { _id: tenantId } = user;

  // Check if the tenant user is in the current owner user's contact list
  const currentOwnerUser = await OwnerUser.findById(userId);
  const isContact = currentOwnerUser.contacts.includes(tenantId.toString());

  res.json({ user, isContact });
};

/**
 * @description Get current user's details
 * @route GET /api/owner/profile
 * @returns {object} 200 - An object containing the user
 */
const getSelfDetail = async (req, res) => {
  const user = await OwnerUser.findById(req.user.userId);
  if (!user) throw new NotFoundError("User not found");
  res.json({ user });
};

/**
 * @description Update current user's details
 * @route PATCH /api/owner/profile
 * @returns {object} 200 - An object containing the user
 */
const updateProfile = async (req, res) => {
  const { phoneNumber, address, gender } = req.body;

  if (!address || !phoneNumber || !gender) {
    throw new BadRequestError("Please fill in all fields");
  }
  const user = await OwnerUser.findByIdAndUpdate(
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

/**
 * @description Toggle Add Contact (Add or Remove Contact)
 * @route PATCH /api/owner/addContact/:id
 * @returns {object} 200 - An object containing the user
 */
const addContactToggle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const tenantUser = await TenantUser.findById(id);

  if (!tenantUser) {
    throw new NotFoundError("Tenant User not found");
  }

  const currentOwnerUser = await OwnerUser.findById(userId);

  if (currentOwnerUser.contacts.includes(id)) {
    currentOwnerUser.contacts = currentOwnerUser.contacts.filter(
      (contactId) => contactId.toString() !== id
    );
    const updatedUser = await OwnerUser.findOneAndUpdate(
      { _id: userId },
      { contacts: currentOwnerUser.contacts },
      { new: true, runValidators: true }
    );
    res.json({ updatedUser, message: "Contact removed", isContact: false });
  } else {
    const updatedUser = await OwnerUser.findOneAndUpdate(
      { _id: userId },
      {
        $push: { contacts: id },
      },
      { new: true, runValidators: true }
    );
    res.json({ updatedUser, message: "Contact added", isContact: true });
  }
};
export { getSingleTenantUser, getSelfDetail, updateProfile, addContactToggle };
