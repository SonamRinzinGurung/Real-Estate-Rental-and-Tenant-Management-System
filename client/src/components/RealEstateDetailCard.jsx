import { format, dateFormatter } from "../utils/valueFormatter";
import { ImageCarousal } from "../components";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import { saveOrUnSaveRealEstate } from "../features/realEstateTenant/realEstateTenantSlice";
import { Button, CircularProgress } from "@mui/material";

const RealEstateDetailCard = ({
  _id,
  title,
  address,
  price,
  realEstateImages,
  createdAt,
  category,
  propertyId,
  slug,
  fromTenant,
  fromOwner,
  isSaved,
  isProcessing,
  status,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      <section className="flex flex-col gap-4 rounded-md ">
        <div className="flex justify-between rounded-md">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">{title}</h3>
            <p className="-ml-1 text-base tracking-tight">
              <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
              {address?.location}, {address?.streetName} ,Kathmandu
            </p>
            <div className="">
              <p className="font-robotoNormal text-xs font-semibold tracking-tight">
                Posted on: {dateFormatter(createdAt)}
              </p>
              <p className="font-robotoNormal text-xs tracking-tight">
                Id: {propertyId}
              </p>
            </div>
          </div>
          <div className="">
            <div className="rounded-md p-2">
              <p className="font-roboto text-primaryDark leading-4 ">
                RENT per month
              </p>
              <span className="font-semibold text-lg text-primaryDark">
                NPR. {format(price)}
              </span>
              <div>
                <p className="font-roboto text-gray-500">{category}</p>
              </div>
            </div>
            {fromTenant && (
              <div
                className="mt-2 cursor-pointer"
                onClick={() => dispatch(saveOrUnSaveRealEstate({ id: _id }))} // dispatching the action to save or un-save the real estate
              >
                {isSaved ? (
                  <Button
                    variant="text"
                    color="secondary"
                    startIcon={<BookmarkRoundedIcon />}
                    size="large"
                    sx={{
                      "&:hover": {
                        color: "error.main",
                        opacity: [0.9, 0.8, 0.7],
                      },
                    }}
                  >
                    {isProcessing ? (
                      <CircularProgress
                        size={26}
                        sx={{
                          color: "#EE9B01",
                        }}
                      />
                    ) : (
                      "UnSave"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="text"
                    color="secondary"
                    startIcon={<BookmarkBorderRoundedIcon />}
                    size="large"
                  >
                    {isProcessing ? (
                      <CircularProgress
                        size={26}
                        sx={{
                          color: "#EE9B01",
                        }}
                      />
                    ) : (
                      "Save"
                    )}
                  </Button>
                )}
              </div>
            )}
            {fromOwner &&
              (status ? (
                <div className="flex flex-wrap  gap-2 mt-2 cursor-pointer text-center">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: "#fff" }}
                    onClick={() => {
                      navigate(`/owner/real-estate/update/${slug}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Link
                    to={`/owner/contract/create`}
                    state={{
                      realEstateId: _id,
                      title: title,
                      price: price,
                      slug: slug,
                    }}
                  >
                    <Button variant="contained" sx={{ color: "#fff" }}>
                      Create Contract
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-2">
                  <Link
                    to={`/owner/contract/${slug}`}
                    state={{ realEstateId: _id }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ color: "#fff" }}
                    >
                      View Contract
                    </Button>
                  </Link>
                </div>
              ))}
          </div>
        </div>
        <ImageCarousal realEstateImages={realEstateImages} />
      </section>
    </>
  );
};

export default RealEstateDetailCard;
