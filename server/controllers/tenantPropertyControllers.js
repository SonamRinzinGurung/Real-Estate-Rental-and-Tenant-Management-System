import RealEstate from "../models/RealEstate.js";
import { NotFoundError } from "../request-errors/index.js";
import TenantUser from "../models/TenantUser.js";

/**
 * @description Get all properties
 * @returns {object} realEstate array
 */
const getAllProperties = async (req, res) => {
  const allRealEstate = await RealEstate.find({}).populate({
    path: "propertyOwner",
    select: "-password -createdAt -updatedAt -__v",
  });
  res.json({ allRealEstate });
};

/**
 * @description Get single property
 * @returns {object} realEstate
 */
const getSingleProperty = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const realEstate = await RealEstate.findById(id).populate({
    path: "propertyOwner",
    select: "-password -createdAt -updatedAt -__v",
  });
  if (!realEstate) {
    throw new NotFoundError(`Property with id: ${id} not found`);
  }

  //check if property is saved by user
  const currentTenantUser = await TenantUser.findById(userId);
  const isSaved = currentTenantUser.savedProperties.includes(id);

  res.json({ realEstate, isSaved });
};

/**
 * @description Save property if not saved otherwise remove from saved list
 * @returns {object} TenantUser
 */
const savePropertyToggle = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const toSaveProperty = await RealEstate.findById(id);

  if (!toSaveProperty) {
    throw new NotFoundError(`Property with id: ${id} not found`);
  }
  const currentTenantUser = await TenantUser.findById(userId);

  //check if property is already saved by user and remove it from saved properties
  if (currentTenantUser.savedProperties.includes(id)) {
    currentTenantUser.savedProperties =
      currentTenantUser.savedProperties.filter(
        (propertyId) => propertyId.toString() !== id
      );
    const updatedUser = await TenantUser.findOneAndUpdate(
      { _id: userId },
      {
        savedProperties: currentTenantUser.savedProperties,
      },
      { new: true, runValidators: true }
    );

    res.json({
      updatedUser,
      message: "Property removed from saved properties",
      isSaved: false,
    });
  } else {
    //add property to saved properties
    const updatedUser = await TenantUser.findOneAndUpdate(
      { _id: userId },
      {
        $push: { savedProperties: id },
      },
      { new: true, runValidators: true }
    );

    res.json({
      updatedUser,
      message: "Property saved successfully",
      isSaved: true,
    });
  }
};

/**
 * @description Get all properties
 * @returns {object} realEstate array
 */
const getAllSavedProperties = async (req, res) => {
  const { userId } = req.user;

  const currentTenantUser = await TenantUser.findById(userId).populate({
    path: "savedProperties",
    populate: {
      path: "propertyOwner",
      model: "OwnerUser",
    },
  });

  if (!currentTenantUser) {
    throw new NotFoundError(`User with id: ${userId} not found`);
  }

  res.json({ savedProperties: currentTenantUser.savedProperties });
};

export {
  getAllProperties,
  getSingleProperty,
  savePropertyToggle,
  getAllSavedProperties,
};
