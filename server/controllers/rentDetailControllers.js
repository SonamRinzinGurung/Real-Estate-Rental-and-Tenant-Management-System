import TenantUser from "../models/TenantUser.js";
import RealEstate from "../models/RealEstate.js";
import RentDetail from "../models/RentDetail.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Create Contract
 * @route PATCH /api/rentPayment
 * @returns {object}
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

export { createRentDetail };
