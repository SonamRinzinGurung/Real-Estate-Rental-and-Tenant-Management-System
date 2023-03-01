import RentDetail from "../models/RentDetail.js";
import PaymentHistory from "../models/PaymentHistory.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Get Single Rent Detail for tenant user
 * @route GET /api/rentDetailTenant/:realEstateId
 * @returns {object} Rent Detail object
 */
const getSingleRentDetailsTenantView = async (req, res) => {
  const rentDetail = await RentDetail.findOne({
    realEstate: req.params.realEstateId,
    tenant: req.user.userId,
  })
    .populate({
      path: "realEstate",
      select: "_id title price address realEstateImages slug",
    })
    .populate({
      path: "owner",
      select: "_id slug email phoneNumber firstName lastName profileImage",
    });

  if (!rentDetail) {
    throw new NotFoundError("Rent detail not found");
  }

  const rentStatus = await rentDetail.isRentPaid();
  res.json({ rentDetail, rentStatus });
};

/**
 * @description Get All Payment History for tenant user
 * @route GET /api/rentDetailTenant/allPaymentHistory/:rentDetailId
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

export { getSingleRentDetailsTenantView, getAllPaymentHistory };
