import RealEstate from "../models/RealEstate.js";

/**
 * @description Post Real Estate
 * @route POST /owner/real-estate
 * @returns {object} realEstate
 */
const postRealEstate = async (req, res) => {
  const location = req.body.location;
  const streetName = req.body.streetName;
  req.body.address = { location, streetName };
  req.body.propertyOwner = req.user.userId;

  const realEstate = await RealEstate.create(req.body);
  res.status(201).json({ realEstate });
};

export { postRealEstate };
