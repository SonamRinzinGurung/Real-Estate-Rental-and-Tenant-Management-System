import RealEstate from "../models/RealEstate.js";
import { nanoid } from "nanoid";

/**
 * @description Post Real Estate
 * @returns {object} realEstate
 */
const postRealEstate = async (req, res) => {
  const location = req.body.location;
  const streetName = req.body.streetName;
  req.body.address = { location, streetName };
  req.body.propertyOwner = req.user.userId;
  req.body.propertyId = nanoid(7);

  const realEstate = await RealEstate.create(req.body);
  res.status(201).json({ realEstate });
};

/**
 * @description Get Owner's Real Estates
 * @returns {object} realEstate
 */
const getOwnerRealEstates = async (req, res) => {
  const realEstates = await RealEstate.find({ propertyOwner: req.user.userId });
  res.json({ realEstates });
};
export { postRealEstate, getOwnerRealEstates };
