import TenantUser from "../models/TenantUser.js";
import OwnerUser from "../models/OwnerUser.js";
import RealEstate from "../models/RealEstate.js";
import Contract from "../models/Contract.js";
import RentDetail from "../models/RentDetail.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import { sendEmail } from "../utils/emailSender.js";

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

  const tenantUser = await TenantUser.findById(tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const realEstateUser = await RealEstate.findById(realEstate);
  if (!realEstateUser) {
    throw new NotFoundError("Real estate not found");
  }

  const rentDetail = await RentDetail.create(req.body);

  res.status(201).json({ rentDetail });
};

export { createRentDetail };
