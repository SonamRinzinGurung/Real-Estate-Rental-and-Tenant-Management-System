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

export { postRealEstate };
