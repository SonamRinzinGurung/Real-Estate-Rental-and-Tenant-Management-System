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

  //check if contract already exists for this tenant and real estate
  const contractExists = await Contract.findOne({
    owner: req.user.userId,
    tenant,
    realEstate,
  });
  if (contractExists) {
    throw new BadRequestError("Contract already exists");
  }

  //check if contract already exists for this real estate
  const contractForRealEstate = await Contract.findOne({
    realEstate,
  });
  if (contractForRealEstate) {
    throw new BadRequestError("Contract already exists for this real estate");
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

  //change the status of the real estate to false
  realEstateUser.status = false;
  await realEstateUser.save();

  const contract = await Contract.create(req.body);
  const to = tenantUser.email;
  const replyTo = ownerUser.email;
  const subject = "Contract created";
  const body = `
    <h3>Contract created</h3>
    <p>Contract created for <strong>${realEstateUser.title}</strong> <span>(${realEstateUser.propertyId})</span></p>
    <p>Please follow the link to view and approve this contract</p>
    <a href="http://localhost:3000/tenant/contract/${contract._id}"><strong>View contract</strong></a>
   <br><br>
    <p>Sincerely,</p>
    <p>${ownerUser.firstName} ${ownerUser.lastName},</p>
    <p>${ownerUser.address}</p>
    `;

  //send email to tenant user to approve the contract
  await sendEmail(to, replyTo, subject, body);

  res.json({ contract });
};

/**
 * @description Get contract details for tenant user
 * @route GET /api/contract/tenantView/:contractId
 * @returns {object} 200 - An object containing the contract details
 */
const getContractDetailTenantView = async (req, res) => {
  const contractDetail = await Contract.findOne({
    _id: req.params.contractId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title address category slug",
    })
    .populate({
      path: "owner",
      select: "slug firstName lastName email address phoneNumber",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

export { createContract, getContractDetailTenantView };
