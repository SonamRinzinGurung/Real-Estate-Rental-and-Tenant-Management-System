import TenantUser from "../models/TenantUser.js";
import RealEstate from "../models/RealEstate.js";
import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Create Contract
 * @route POST /api/rentDetail/createDetail
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
    })
    .sort({ createdAt: -1 });

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
      select: "_id firstName lastName profileImage slug email phoneNumber",
    })
    .populate({
      path: "owner",
      select: "_id slug email phoneNumber firstName lastName",
    });

  if (!rentDetail) {
    throw new NotFoundError("Rent detail not found");
  }

  const rentStatus = await rentDetail.isRentPaid();

  res.json({ rentDetail, rentStatus });
};

/**
 * @description Create rent payment history
 * @route POST /api/rentDetail/createPaymentHistory
 * @returns {object} Payment Detail Object
 */
const createPaymentHistory = async (req, res) => {
  const { rentDetail } = req.body;

  // check if rent detail exists
  const checkRentDetail = await RentDetail.findById(rentDetail);
  if (!checkRentDetail) {
    throw new NotFoundError("Rent detail not found");
  }
  const rentStatus = await checkRentDetail.isRentPaid();

  if (rentStatus) {
    throw new BadRequestError(
      "Rent payment for this month is already registered."
    );
  }

  const { currentRentDate, amountPaid, paymentMethod, nextRentDueDate } =
    req.body;

  const paymentDetail = await PaymentHistory.create({
    rentDetail,
    currentRentDate,
    amountPaid,
    paymentMethod,
  });

  // update next rent due date
  checkRentDetail.currentRentDate = nextRentDueDate;
  await checkRentDetail.save();

  res.status(201).json({ paymentDetail, msg: "Payment detail created" });
};

/**
 * @description Get All Payment History for owner user
 * @route GET /api/rentDetail/allPaymentHistory/:rentDetailId
 * @returns {object} All Payment History Array
 */
const getAllPaymentHistory = async (req, res) => {
  let paymentHistoryResults = PaymentHistory.find({
    rentDetail: req.params.rentDetailId,
  }).sort({ createdAt: -1 });

  const page = Number(req.query.page) || 1; //page number from query string
  const limit = Number(req.query.limit) || 5; //limit of items per response
  const skip = (page - 1) * limit; //calculate the number of documents to skip

  // get the results from the database
  paymentHistoryResults = paymentHistoryResults.skip(skip).limit(limit);
  const allPaymentHistory = await paymentHistoryResults; //execute the query

  // get the total number of documents in the collection
  const totalPaymentHistory = await PaymentHistory.countDocuments({
    rentDetail: req.params.rentDetailId,
  });

  // calculate the total number of pages
  const numberOfPages = Math.ceil(totalPaymentHistory / limit);

  res.json({ allPaymentHistory, numberOfPages, totalPaymentHistory });
};

export {
  createRentDetail,
  getAllRentDetailsOwnerView,
  getSingleRentDetailsOwnerView,
  createPaymentHistory,
  getAllPaymentHistory,
};
