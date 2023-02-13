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
    <a href="http://localhost:3000/tenant/contract-agreement/${contract._id}"><strong>View contract</strong></a>
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
    })
    .populate({
      path: "tenant",
      select: "firstName lastName",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Approve contract
 * @route PATCH /api/contract/approve/:contractId
 * @returns {object} 200 - An object containing the contract details
 */
const approveContract = async (req, res) => {
  const contractDetail = await Contract.findOne({
    _id: req.params.contractId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title",
    })
    .populate({
      path: "owner",
      select: "firstName lastName email",
    })
    .populate({
      path: "tenant",
      select: "firstName lastName email address",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  //change the status of the contract to true
  contractDetail.status = "Active";
  await contractDetail.save();

  const to = contractDetail.owner.email;
  const replyTo = contractDetail.tenant.email;
  const subject = "Contract approved";
  const body = `
    <h3>Contract approved</h3>
    <p>Contract for <strong>${contractDetail.realEstate.title}</strong> has been approved and accepted.</p>
    <br><br>
    <p>Sincerely,</p>
    <p>${contractDetail.tenant.firstName} ${contractDetail.tenant.lastName},</p>
    <p>${contractDetail.tenant.address}</p>
    `;

  //send email to owner user to approve the contract
  await sendEmail(to, replyTo, subject, body);

  res.json({ contractDetail });
};

/**
 * @description Get contract details for owner user
 * @route GET /api/contract/ownerView/:realEstateId
 * @returns {object} 200 - An object containing the contract details
 */
const getContractDetailOwnerView = async (req, res) => {
  const contractDetail = await Contract.findOne({
    owner: req.user.userId,
    realEstate: req.params.realEstateId,
  })
    .populate({
      path: "realEstate",
      select: "title address category slug",
    })
    .populate({
      path: "tenant",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "owner",
      select: "firstName lastName",
    });

  if (!contractDetail) {
    throw new NotFoundError("Contract not found");
  }

  res.json({ contractDetail });
};

/**
 * @description Delete contract
 * @route GET /api/contract/ownerView/:realEstateId
 * @returns
 */
const deleteContract = async (req, res) => {
  const contract = await Contract.findOneAndRemove({
    _id: req.params.contractId,
    owner: req.user.userId,
  });

  if (!contract) {
    throw new NotFoundError("Contract not found");
  }

  if (contract.status === "Active") {
    throw new BadRequestError("Contract is active. You cannot delete it");
  }

  //change the status of the real estate to true
  const realEstate = await RealEstate.findById(contract.realEstate);
  realEstate.status = true;
  await realEstate.save();

  res.json({ message: "Contract deleted successfully", success: true });
};

/**
 * @description Get All Owner's Contracts
 * @route GET /api/contract/owner/allContracts
 * @returns
 */
const getOwnerAllContracts = async (req, res) => {
  const allContracts = await Contract.find({ owner: req.user.userId })
    .populate({
      path: "realEstate",
      select: "title _id",
    })
    .populate({
      path: "tenant",
      select: "_id firstName lastName",
    });

  res.json({ allContracts });
};

/**
 * @description Get the active rental properties of the tenant user
 * @route GET /api/contract/tenantUser/allRentalProperties
 * @returns property details
 */
const getAllTenantRentalProperties = async (req, res) => {
  const allRentalProperties = await Contract.find({
    tenant: req.user.userId,
    status: "Active",
  }).populate({
    path: "realEstate",
    select: "title address category slug realEstateImages",
  });

  res.json({ allRentalProperties, count: allRentalProperties.length });
};

export {
  createContract,
  getContractDetailTenantView,
  approveContract,
  getContractDetailOwnerView,
  deleteContract,
  getOwnerAllContracts,
  getAllTenantRentalProperties,
};
