import RealEstate from "../models/RealEstate.js";
import { NotFoundError } from "../request-errors/index.js";

/**
 * @description Get all properties
 * @returns {object} realEstate array
 */
const getAllProperties = async (req, res) => {
  const realEstate = await RealEstate.find({}).populate({
    path: "propertyOwner",
    select: "-password -createdAt -updatedAt -__v",
  });
  res.json({ realEstate });
};

/**
 * @description Get single property
 * @returns {object} realEstate
 */
const getSingleProperty = async (req, res) => {
  const { id } = req.params;
  const realEstate = await RealEstate.findById(id).populate({
    path: "propertyOwner",
    select: "-password -createdAt -updatedAt -__v",
  });
  if (!realEstate) {
    throw new NotFoundError(`Property with id: ${id} not found`);
  }
  res.json({ realEstate });
};

export { getAllProperties, getSingleProperty };
