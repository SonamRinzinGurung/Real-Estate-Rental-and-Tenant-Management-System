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

  const user = await TenantUser.findOne({ slug }).select(
    "-savedProperties -contacts -accountVerificationToken"
  );

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

  // Check if the tenant user is in the current owner user's contact list and remove them if they are
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
    // Add the tenant user to the current owner user's contact list
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

/**
 * @description Get All Contacts
 * @route PATCH /api/owner/contacts/all
 * @returns {object} 200 - An array containing the contact users
 */
const getAllContacts = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.query;

  // Get the current owner user's contact list
  const currentOwnerUser = await OwnerUser.findById(userId).populate({
    path: "contacts",
    select:
      "-savedProperties -contacts -accountVerificationToken -createdAt -updatedAt -__v",
  });

  if (!currentOwnerUser) throw new NotFoundError("User not found");

  let contacts = currentOwnerUser.contacts; // Get the current owner user's contact list
  // Filter the contact list by name if a name is provided in the query
  if (name) {
    contacts = contacts.filter((contact) => {
      return (
        contact.firstName.toLowerCase().includes(name.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(name.toLowerCase())
      );
    });
  }

  // reverse the contact list so that the most recent contact is at the top
  contacts = contacts.reverse();

  res.json({ contacts });
};

export {
  getSingleTenantUser,
  getSelfDetail,
  updateProfile,
  addContactToggle,
  getAllContacts,
};
