import TenantUser from "../models/TenantUser.js";
import OwnerUser from "../models/OwnerUser.js";
import RealEstate from "../models/RealEstate.js";
import Lease from "../models/Lease.js";
import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";

import { NotFoundError, BadRequestError } from "../request-errors/index.js";
import { sendEmail } from "../utils/emailSender.js";

/**
 * @description Create Lease
 * @route POST /api/owner/lease
 * @returns {object} Lease object
 */
const createLease = async (req, res) => {
  const { tenant, realEstate } = req.body;
  req.body.owner = req.user.userId;

  //check if lease already exists for this tenant and real estate
  const leaseExists = await Lease.findOne({
    owner: req.user.userId,
    tenant,
    realEstate,
  });
  if (leaseExists) {
    throw new BadRequestError("Lease already exists");
  }

  //check if lease already exists for this real estate
  const leaseForRealEstate = await Lease.findOne({
    realEstate,
  });
  if (leaseForRealEstate) {
    throw new BadRequestError("Lease already exists for this real estate");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  const tenantUser = await TenantUser.findById(tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const leaseProperty = await RealEstate.findById(realEstate);
  if (!leaseProperty) {
    throw new NotFoundError("Real estate not found");
  }

  const lease = await Lease.create(req.body);
  const to = tenantUser.email;
  const from = ownerUser.email;
  const subject = `Lease created for rental of property titled ${leaseProperty.title}`;
  const body = `
    <p> Dear ${tenantUser.firstName} ${tenantUser.lastName},</p>    
    <p>I hope this email finds you well. I am writing to inform you that the lease for rental of property titled <strong>${leaseProperty.title}</strong> located at ${leaseProperty.address.streetName}, ${leaseProperty.address.city}, ${leaseProperty.address.state}, ${leaseProperty.address.country} has been created successfully.</p>
    <p>Please follow the link to view and provide additional information to complete the lease. Please carefully review the rental lease and let us know if you have any questions or concerns.</p>
    <a href="${process.env.CLIENT_URL}/#/tenant/lease-form/${leaseProperty._id}"><strong>Complete Lease</strong></a><br>
    <p>Please note that the rental lease is legally binding, and both parties are required to adhere to its terms and conditions.</p>
    <p>If you have any questions or concerns about the rental lease or the rental process, please do not hesitate to contact me.</p>
   <br><br>
    <p>Best regards,</p>
    <p>${ownerUser.firstName} ${ownerUser.lastName}</p>`;

  //send email to tenant user to approve the lease
  await sendEmail(to, from, subject, body);

  //change the status of the real estate to false to indicate it is rented
  leaseProperty.status = false;
  await leaseProperty.save();

  res.json({ lease });
};

/**
 * @description Approve lease
 * @route PATCH /api/lease/approve/:leaseId
 * @returns {object} 200 - An object containing the lease details
 */
const approveLease = async (req, res) => {
  const { digitalSignature, leaseSignTime } = req.body;
  const leaseDetail = await Lease.findOne({
    _id: req.params.leaseId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title address",
    })
    .populate({
      path: "owner",
      select: "firstName lastName email",
    })
    .populate({
      path: "tenant",
      select: "firstName lastName email address",
    });

  if (!leaseDetail) {
    throw new NotFoundError("Lease not found");
  }

  const to = leaseDetail.owner.email;
  const from = leaseDetail.tenant.email;
  const subject = `Lease approved for rental of property titled ${leaseDetail.realEstate.title}`;
  const body = `
    <p> Dear ${leaseDetail.owner.firstName} ${leaseDetail.owner.lastName},</p> 
    <p>Thank you for your email informing me that the rental lease has been created for the property titled <strong>${leaseDetail.realEstate.title}</strong> at ${leaseDetail.realEstate.address.location}, ${leaseDetail.realEstate.address.streetName}. 
    I have carefully reviewed the terms and conditions outlined in the rental agreement and I am pleased to inform you that I agree to the terms and conditions.</p>
    <p>I appreciate the effort you have put into creating a rental agreement that protects the interests of both parties. I look forward to a positive and mutually beneficial relationship with you as my landlord.</p>
    <p>Thank you for your assistance.</p>
    <br><br>
    <p>Best Regards,</p>
    <p>${leaseDetail.tenant.firstName} ${leaseDetail.tenant.lastName}</p>
    `;

  //send email to owner user to approve the lease
  await sendEmail(to, from, subject, body);

  //change the status of the lease to true
  leaseDetail.status = "Active";
  leaseDetail.digitalSignature = digitalSignature;
  leaseDetail.leaseSignTime = leaseSignTime;
  await leaseDetail.save();

  res.json({ leaseDetail });
};

/**
 * @description Get lease details for owner user
 * @route GET /api/lease/ownerView/:realEstateId
 * @returns {object} 200 - An object containing the lease details
 */
const getLeaseDetailOwnerView = async (req, res) => {
  const leaseDetail = await Lease.findOne({
    owner: req.user.userId,
    realEstate: req.params.realEstateId,
    status: { $in: ["Active", "Pending", "Terminated-pending", "Terminated-approved"] }
  })
    .populate({
      path: "realEstate",
      select: "title address category slug price",
    })
    .populate({
      path: "tenant",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "owner",
      select: "firstName lastName",
    });

  if (!leaseDetail) {
    throw new NotFoundError("Lease not found");
  }

  res.json({ leaseDetail });
};

const terminateLease = async (req, res) => {
  const lease = await Lease.findOne({
    _id: req.params.leaseId,
    owner: req.user.userId,
    status: "Active",
  });

  if (!lease) {
    throw new NotFoundError("Lease not found");
  }

  // Terminate the lease
  lease.status = "Terminated-pending";
  await lease.save();

  //send email to tenant user that lease has been terminated pending approval

  // get the tenant user and owner user details to send email
  const tenantUser = await TenantUser.findById(lease.tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const realEstate = await RealEstate.findById(lease.realEstate);
  if (!realEstate) {
    throw new NotFoundError("Real Estate Not Found");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  //email details
  const to = tenantUser.email;
  const from = ownerUser.email;
  const subject = `Lease termination information of ${realEstate.title}`;
  const body = `
    <p> Dear ${tenantUser.firstName} ${tenantUser.lastName},</p>    
    <p>I hope this email finds you well. I am writing to inform you about the termination of the rental lease of property titled <strong>${realEstate.title}</strong> 
    located at ${realEstate.address.streetName}, ${realEstate.address.city}, ${realEstate.address.state}, ${realEstate.address.country}</p>
    <p> Please note that the lease is now in a "Terminated-pending" status. This means that the termination process has been initiated, but it is not yet final. 
    Please view your lease details to approve the termination of the lease.</p>
    <p>Once you approve the termination, we will proceed with the necessary steps to finalize the termination of the lease. 
    This may include scheduling a final inspection of the property, settling any outstanding rent payments, and returning your security deposit.</p>
    <p>Please note that you are required to vacate the property within 7 days of approving the termination.</p>
    <p>Thank you for your cooperation during your stay at our property.</p>
    <br><br>
    <p>Best regards,</p>
    <p>${ownerUser.firstName} ${ownerUser.lastName}</p>`;

  //send email to tenant user that lease has been deleted
  await sendEmail(to, from, subject, body);

  res.json({ message: "Lease updated to pending termination successfully", success: true });
};

const terminateLeaseApprove = async (req, res) => {
  const lease = await Lease.findOne({
    _id: req.params.leaseId,
    tenant: req.user.userId,
    status: "Terminated-pending",
  });

  if (!lease) {
    throw new NotFoundError("Lease not found");
  }

  // approve the termination of the lease
  lease.status = "Terminated-approved";
  await lease.save();

  //send email to owner user that lease has been approved for termination

  // get the tenant user and owner user details to send email
  const ownerUser = await OwnerUser.findById(lease.owner);
  if (!ownerUser) {
    throw new NotFoundError("Owner user not found");
  }

  const realEstate = await RealEstate.findById(lease.realEstate);
  if (!realEstate) {
    throw new NotFoundError("Real Estate Not Found");
  }

  const tenantUser = await TenantUser.findById(req.user.userId);

  //email details
  const to = ownerUser.email;
  const from = tenantUser.email;
  const subject = `Lease termination approved of ${realEstate.title}`;
  const body = `
    <p> Dear ${ownerUser.firstName} ${ownerUser.lastName},</p>    
    <p>I hope this email finds you well. This email is to inform you that the rental lease of property titled <strong>${realEstate.title}</strong> 
    located at ${realEstate.address.streetName}, ${realEstate.address.city}, ${realEstate.address.state}, ${realEstate.address.country} has been approved for termination.</p>
    <p> Please note that the lease is now in a "Terminated-approved" status. This means that the termination process has been finalized. 
    Please view your lease details for more information and to take the next steps to finalize the lease termination.</p>
    <p>Thank you for your cooperation.</p>
    <br><br>
    <p>Best regards,</p>
    <p>${tenantUser.firstName} ${tenantUser.lastName}</p>`;

  //send email to tenant user that lease has been deleted
  await sendEmail(to, from, subject, body);

  res.json({ message: "Lease updated to approved termination successfully", success: true });
};

/**
 * @description Delete lease
 * @route GET /api/lease/ownerView/:realEstateId
 * @returns
 */
const deleteLease = async (req, res) => {
  const lease = await Lease.findOneAndDelete({
    _id: req.params.leaseId,
    owner: req.user.userId,
  });

  if (!lease) {
    throw new NotFoundError("Lease not found");
  }

  const realEstate = await RealEstate.findById(lease.realEstate);
  if (!realEstate) {
    throw new NotFoundError("Real Estate Not Found");
  }

  //change the status of the real estate to true
  realEstate.status = true;
  await realEstate.save();

  //delete the rent detail of the lease from the rent detail collection
  const rentDetail = await RentDetail.findOneAndDelete({
    realEstate: lease.realEstate,
    tenant: lease.tenant,
    owner: lease.owner,
  });

  if (rentDetail) {
    //delete the payment history of the lease from the payment history collection using the rent detail id
    await PaymentHistory.deleteMany({
      rentDetail: rentDetail._id,
    });
  }

  //send email to tenant user that lease has been deleted

  // get the tenant user and owner user details to send email
  const tenantUser = await TenantUser.findById(lease.tenant);
  if (!tenantUser) {
    throw new NotFoundError("Tenant user not found");
  }

  const ownerUser = await OwnerUser.findById(req.user.userId);

  //email details
  const to = tenantUser.email;
  const from = ownerUser.email;
  const subject = `Lease terminated of property titled ${realEstate.title}`;
  const body = `
    <p> Dear ${tenantUser.firstName} ${tenantUser.lastName},</p>    
    <p>I hope this email finds you well. I am writing to inform you about the termination of the rental lease of property titled <strong>${realEstate.title}</strong> 
    located at ${realEstate.address.location}, ${realEstate.address.streetName}</p>
    <p>The lease was terminated successfully along with the rent details and payment histories associated with it.</p>
    <p>Please note that you are required to vacate the property within 7 days. 
    We will conduct a final inspection of the property to ensure that it is in the same condition as when you moved in, 
    with reasonable wear and tear accepted. 
    Any damages or outstanding rent payments will be deducted from your security deposit.</p>
   <p>Thank you for your cooperation during your stay at our property.</p>
    <br><br>
    <p>Best regards,</p>
    <p>${ownerUser.firstName} ${ownerUser.lastName}</p>`;

  //send email to tenant user that lease has been deleted
  await sendEmail(to, from, subject, body);

  res.json({ message: "Lease terminated successfully", success: true });
};

/**
 * @description Get All Owner's Leases
 * @route GET /api/lease/owner/allLeases
 * @returns
 */
const getOwnerAllLeases = async (req, res) => {
  const allLeases = await Lease.find({
    owner: req.user.userId,
    status: "Active",
  })
    .populate({
      path: "realEstate",
      select: "title _id",
    })
    .populate({
      path: "tenant",
      select: "_id firstName lastName",
    });

  res.json({ allLeases });
};

/**
 * @description Get the active rental properties of the tenant user
 * @route GET /api/lease/tenantUser/allRentalProperties
 * @returns property details
 */
const getAllTenantRentalProperties = async (req, res) => {
  const allRentalProperties = await Lease.find({
    tenant: req.user.userId,
    status: { $in: ["Active", "Terminated-pending", "Terminated-approved"] },
  }).populate({
    path: "realEstate",
    select: "title address category slug realEstateImages price",
    populate: {
      path: "propertyOwner",
      model: "OwnerUser",
      select: "-createdAt -updatedAt -__v -contacts",
    },
  });

  res.json({ allRentalProperties, count: allRentalProperties.length });
};

/**
 * @description Get the lease details for the tenant user using the real estate id
 * @route GET /api/lease/tenant/:realEstateId
 * @returns {object} 200 - An object containing the lease details
 */
const getTenantLeaseDetail = async (req, res) => {
  const leaseDetail = await Lease.findOne({
    realEstate: req.params.realEstateId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "title address category slug price",
    })
    .populate({
      path: "owner",
      select: "slug firstName lastName email address phoneNumber",
    })
    .populate({
      path: "tenant",
      select: "firstName lastName",
    });

  if (!leaseDetail) {
    throw new NotFoundError("Lease not found");
  }

  res.json({ leaseDetail });
};

/**
 * @description Update lease form details for the tenant user
 * @route PATCH /api/lease/tenant/updateLeaseForm/:leaseId
 * @returns {object} 200 - An object containing the updated lease details
 */
const leaseUpdateForm = async (req, res) => {
  const { leaseId } = req.params;
  const updateData = req.body;
  console.log("body", updateData);
  if (req.files) {
    console.log(req.files)
  }

  const updatedLease = await Lease.findByIdAndUpdate(leaseId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedLease) {
    throw new NotFoundError("Lease not found");
  }

  const isTenantInfoComplete = updatedLease.isTenantInfoComplete();

  if (isTenantInfoComplete) {
    updatedLease.status = "Active";
    await updatedLease.save();
  } else {
    throw new BadRequestError("Incomplete tenant information to activate lease");
  }

  res.json({ updatedLease });
};

export {
  createLease,
  approveLease,
  getLeaseDetailOwnerView,
  deleteLease,
  getOwnerAllLeases,
  getAllTenantRentalProperties,
  getTenantLeaseDetail,
  terminateLease,
  terminateLeaseApprove,
  leaseUpdateForm,
};
