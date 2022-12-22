import RealEstate from "../models/RealEstate.js";

const addProperty = async (req, res) => {
  const location = req.body.location;
  const streetName = req.body.streetName;
  req.body.address = { location, streetName };
  req.body.propertyOwner = req.user.userId;

  const property = await RealEstate.create(req.body);
  res.status(201).json({ property });
};

export { addProperty };
