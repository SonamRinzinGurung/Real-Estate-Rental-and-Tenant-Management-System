import RealEstate from "../models/RealEstate.js";

/**
 * @description View the properties
 * @route POST /tenant/real-estate
 * @returns {object} realEstate
 */
const viewProperties = async (req, res) => {
  const realEstate = await RealEstate.find({}).populate({
    path: "propertyOwner",
    select: "-password -createdAt -updatedAt -__v",
  });
  res.status(200).json({ realEstate });
};

export { viewProperties };
