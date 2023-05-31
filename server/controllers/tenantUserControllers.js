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
  const { userId } = req.user;

  const user = await OwnerUser.findOne({ slug }).select(
    "-contacts -accountVerificationToken"
  );

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { _id: ownerId } = user;

  // Check if the owner user is in the current tenant user's contact list
  const currentTenantUser = await TenantUser.findById(userId);
  const isContact = currentTenantUser.contacts.includes(ownerId.toString());

  const realEstates = await RealEstate.find({ propertyOwner: user._id });

  res.json({ user, realEstates, isContact });
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

/**
 * @description Toggle Add Contact (Add or Remove Contact)
 * @route PATCH /api/tenant/addContact/:id
 * @returns {object} 200 - An object containing the user
 */
const addContactToggle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const ownerUser = await OwnerUser.findById(id);

  if (!ownerUser) {
    throw new NotFoundError("Tenant User not found");
  }

  const currentTenantUser = await TenantUser.findById(userId);

  // Check if the owner user is in the current tenant user's contact list and remove them if they are
  if (currentTenantUser.contacts.includes(id)) {
    currentTenantUser.contacts = currentTenantUser.contacts.filter(
      (contactId) => contactId.toString() !== id
    );
    const updatedUser = await TenantUser.findOneAndUpdate(
      { _id: userId },
      { contacts: currentTenantUser.contacts },
      { new: true, runValidators: true }
    );
    res.json({ updatedUser, message: "Contact removed", isContact: false });
  } else {
    // Add the owner user to the current tenant user's contact list
    const updatedUser = await TenantUser.findOneAndUpdate(
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
 * @route PATCH /api/tenant/contacts/all
 * @returns {object} 200 - An array containing the contact users
 */
const getAllContacts = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.query;

  // Get the current owner user's contact list
  const currentTenantUser = await TenantUser.findById(userId).populate({
    path: "contacts",
    select: "-contacts -accountVerificationToken -createdAt -updatedAt -__v",
  });

  if (!currentTenantUser) throw new NotFoundError("User not found");

  let contacts = currentTenantUser.contacts; // Get the current owner user's contact list
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
  getSingleOwnerUser,
  getSelfDetail,
  updateProfile,
  addContactToggle,
  getAllContacts,
};
