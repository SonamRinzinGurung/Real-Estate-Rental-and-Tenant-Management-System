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
  let realEstateResults = RealEstate.find({
    propertyOwner: req.user.userId,
  }).sort("-createdAt");

  const page = Number(req.query.page) || 1; //page number from query string
  const limit = 3; //limit of items per response
  const skip = (page - 1) * limit; //calculate the number of documents to skip

  realEstateResults = realEstateResults.skip(skip).limit(limit);
  const realEstates = await realEstateResults; //execute the query

  //get total documents in the RealEstate collection
  const totalRealEstates = await RealEstate.countDocuments({
    propertyOwner: req.user.userId,
  });

  //calculate total pages
  const numberOfPages = Math.ceil(totalRealEstates / limit);

  res.json({ realEstates, numberOfPages, totalRealEstates });
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

/**
 * @description Update Property Details
 * @returns message
 */
const deleteProperty = async (req, res) => {
  const { slug } = req.params;
  const realEstate = await RealEstate.findOne({ slug });

  if (!realEstate) {
    throw new NotFoundError(`Property not found`);
  }

  // check if user is authorized to delete property
  if (realEstate.propertyOwner.toString() !== req.user.userId) {
    throw new ForbiddenRequestError(
      "You are not authorized to delete this property"
    );
  }

  // check if property is okay to delete
  if (realEstate.status === false) {
    throw new BadRequestError(
      "Property cannot be deleted, it has active tenant"
    );
  }

  await RealEstate.findOneAndDelete({
    slug,
    propertyOwner: req.user.userId,
    status: true,
  });

  res.json({ success: true, message: "Property deleted successfully" });
};

export {
  postRealEstate,
  getOwnerRealEstates,
  getSingleProperty,
  updatePropertyDetails,
  deleteProperty,
};
