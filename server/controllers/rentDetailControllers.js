import TenantUser from "../models/TenantUser.js";
import RealEstate from "../models/RealEstate.js";
import RentDetail from "../models/RentDetail.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Create Contract
 * @route PATCH /api/rentDetail/createDetail
 * @returns {object} rent detail object
 */
const createRentDetail = async (req, res) => {
  const { tenant, realEstate } = req.body;
  req.body.owner = req.user.userId;

  // check if rent detail already exists for this tenant and real estate
  const rentDetailExists = await RentDetail.findOne({
    owner: req.user.userId,
    tenant,
    realEstate,
  });
  if (rentDetailExists) {
    throw new BadRequestError("Rent detail already exists");
  }

  // check if rent detail already exists for this real estate
  const rentDetailExistsForRealEstate = await RentDetail.findOne({
    realEstate,
  });
  if (rentDetailExistsForRealEstate) {
    throw new BadRequestError(
      "Rent Detail already exists for this real estate"
    );
  }

  const tenantUser = await TenantUser.findById(tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const realEstateUser = await RealEstate.findById(realEstate);
  if (!realEstateUser) {
    throw new NotFoundError("Real estate not found");
  }

  const rentDetail = await RentDetail.create(req.body);

  res
    .status(201)
    .json({ rentDetail, msg: "Rent detail created", success: true });
};

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 * @returns {object} Rent Details Array
 */
const getAllRentDetailsOwnerView = async (req, res) => {
  const rentDetails = await RentDetail.find({ owner: req.user.userId })
    .populate({
      path: "realEstate",
      select: "_id title price address category realEstateImages slug",
    })
    .populate({
      path: "tenant",
      select: "_id firstName lastName address profileImage slug email",
    })
    .populate({
      path: "owner",
      select: "_id firstName lastName address profileImage slug email",
    });

  res.json({ rentDetails, count: rentDetails.length });
};

/**
 * @description Get all the Rent Details for owner user
 * @route GET /api/rentDetail/allRentDetails
 * @returns {object} Rent Details Array
 */
const getSingleRentDetailsOwnerView = async (req, res) => {
  const rentDetail = await RentDetail.findById(req.params.rentDetailId)
    .populate({
      path: "realEstate",
      select: "_id title price address category realEstateImages slug",
    })
    .populate({
      path: "tenant",
      select:
        "_id firstName lastName address profileImage slug email phoneNumber",
    })
    .populate({
      path: "owner",
      select: "_id slug",
    });

  if (!rentDetail) {
    throw new NotFoundError("Rent detail not found");
  }

  res.json({ rentDetail });
};

export {
  createRentDetail,
  getAllRentDetailsOwnerView,
  getSingleRentDetailsOwnerView,
};
