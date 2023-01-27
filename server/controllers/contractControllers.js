import TenantUser from "../models/TenantUser.js";
import OwnerUser from "../models/OwnerUser.js";
import RealEstate from "../models/RealEstate.js";
import Contract from "../models/Contract.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import { sendEmail } from "../utils/emailSender.js";

/**
 * @description Create Contract
 * @route PATCH /api/owner/contract
 * @returns {object} Contract object
 */
const createContract = async (req, res) => {
  const { tenant, realEstate } = req.body;
  req.body.owner = req.user.userId;

  const contractExists = await Contract.findOne({
    owner: req.user.userId,
    tenant,
    realEstate,
  });

  if (contractExists) {
    throw new BadRequestError("Contract already exists");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  const tenantUser = await TenantUser.findById(tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const realEstateUser = await RealEstate.findById(realEstate);
  if (!realEstateUser) {
    throw new NotFoundError("Real estate not found");
  }

  const contract = await Contract.create(req.body);
  const to = tenantUser.email;
  const replyTo = ownerUser.email;
  const subject = "Contract created";
  const body = `
    <h1>Contract created</h1>
    <p>Contract created for ${realEstateUser.title} <span>(${realEstateUser.propertyId})</span></p>
    <p>Please follow the link to view and approve this contract</p>
    <a href="http://localhost:3000/tenant/contract/${contract._id}">View contract</a>
    `;

  await sendEmail(to, replyTo, subject, body);

  res.json({ contract });
};

export { createContract };
