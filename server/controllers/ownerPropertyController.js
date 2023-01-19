import RealEstate from "../models/RealEstate.js";
import { nanoid } from "nanoid";
import {
  NotFoundError,
  ForbiddenRequestError,
  BadRequestError,
} from "../request-errors/index.js";

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

/**
 * @description Get single property
 * @returns {object} realEstate
 */
const getSingleProperty = async (req, res) => {
  const { slug } = req.params;
  const realEstate = await RealEstate.findOne({ slug });
  if (!realEstate) {
    throw new NotFoundError(`Property not found`);
  }
  res.json({ realEstate });
};

/**
 * @description Update Property Details
 * @returns {object} realEstate
 */
const updatePropertyDetails = async (req, res) => {
  const {
    price,
    location,
    streetName,
    description,
    area,
    floors,
    facing,
    category,
  } = req.body;

  if (
    !price ||
    !location ||
    !streetName ||
    !description ||
    !area ||
    !floors ||
    !facing ||
    !category
  ) {
    throw new BadRequestError("All fields are required");
  }

  const { slug } = req.params;
  const realEstate = await RealEstate.findOne({ slug });

  if (!realEstate) {
    throw new NotFoundError(`Property not found`);
  }

  if (realEstate.propertyOwner.toString() !== req.user.userId) {
    throw new ForbiddenRequestError(
      "You are not authorized to update this property"
    );
  }

  const updatedRealEstate = await RealEstate.findOneAndUpdate(
    { slug },
    {
      price,
      description,
      area,
      floors,
      facing,
      category,
      address: { location, streetName },
    },
    { new: true, runValidators: true }
  );

  res.json({ updatedRealEstate });
};

export {
  postRealEstate,
  getOwnerRealEstates,
  getSingleProperty,
  updatePropertyDetails,
};
