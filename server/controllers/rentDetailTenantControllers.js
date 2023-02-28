import RentDetail from "../models/RentDetail.js";
import { NotFoundError, BadRequestError } from "../request-errors/index.js";

/**
 * @description Get Single Rent Detail for tenant user
 * @route GET /api/rentDetailTenant/:realEstateId
 * @returns {object} Rent Details Array
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

export { getSingleRentDetailsTenantView };
