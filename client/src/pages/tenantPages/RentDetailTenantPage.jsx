import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSingleRentDetailTenantView } from "../../features/rentDetailTenant/rentDetailTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, Footer, ImageCarousal } from "../../components";
import { CardActionArea, Avatar, Button } from "@mui/material";
import {
  dateFormatter,
  format,
  calculateNextDueDate,
} from "../../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import moment from "moment";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const RentDetailTenantPage = () => {
  const { slug, realEstateId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rentDetail, isLoading, isRentPaid } = useSelector(
    (state) => state.rentDetailTenant
  );

  useEffect(() => {
    dispatch(getSingleRentDetailTenantView({ realEstateId }));
  }, [realEstateId, dispatch]);

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return (
      <>
        <div className="flex flex-col mx-10">
          <h1 className="mt-6 text-center">Rent Detail Not Found</h1>
          <Button
            size="large"
            variant="text"
            onClick={() => navigate(`/tenant/rental-properties/${slug}`)}
          >
            Go Back
          </Button>
        </div>
      </>
    );

  return (
    <>
      <main className="mb-12 mt-10 mx-4 md:mx-12">
        <h3 className="mb-4 font-heading font-bold">Rent Detail</h3>
        <section className="flex flex-col gap-12 rounded-md md:flex-row">
          <div className="w-full md:w-2/3">
            <ImageCarousal
              realEstateImages={rentDetail?.realEstate?.realEstateImages}
            />
          </div>
          <div className="">
            <div className="flex flex-col gap-2">
              <Link to={`/owner/real-estate/${rentDetail?.realEstate?.slug}`}>
                <h3 className="font-semibold hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                  {rentDetail?.realEstate?.title}
                </h3>
              </Link>

              <p className="-ml-1 text-base tracking-tight">
                <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                {rentDetail?.realEstate?.address?.location},{" "}
                {rentDetail?.realEstate?.address?.streetName} ,Kathmandu
              </p>
            </div>
            <div className="mt-4 text-primaryDark">
              <p className="font-roboto leading-4 ">Rent per month</p>
              <span className="font-semibold text-lg">
                NPR. {format(rentDetail?.realEstate?.price)}
              </span>
            </div>
            <div className="mt-4">
              <p className="font-robotoNormal">
                <span className="font-medium">Payment Plan:</span>{" "}
                {rentDetail?.paymentPlan}
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Current Rent Date:</span>{" "}
                {moment(rentDetail?.currentRentDate.from).format("MMM Do")} -{" "}
                {dateFormatter(rentDetail?.currentRentDate.to)}
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Next Rent Due:</span>{" "}
                {dateFormatter(
                  calculateNextDueDate(rentDetail?.currentRentDate.to)
                )}
              </p>
              <p className="font-robotoNormal">
                <span className="font-medium">Rent Status:</span>{" "}
                {isRentPaid === true ? (
                  <>
                    <DoneRoundedIcon color="success" /> Paid
                  </>
                ) : (
                  <>
                    <CloseRoundedIcon color="error" /> Not Paid
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
        <div className="mt-8">
          <Link to={`/tenant/owner-user/${rentDetail?.owner?.slug}`}>
            <CardActionArea sx={{ borderRadius: "0.375rem" }}>
              <div className="p-4 shadow-lg rounded-md">
                <div className="flex gap-2 items-center">
                  <h4 className="font-medium">Owner Info</h4>
                  <ContactsRoundedIcon color="secondary" />
                </div>
                <div className="flex mt-4 gap-2 items-center">
                  <Avatar
                    src={rentDetail?.owner?.profileImage}
                    alt={(rentDetail?.owner?.firstName).toUpperCase()}
                  />
                  <h5 className="leading-4 font-serif">
                    {rentDetail?.owner?.firstName} {rentDetail?.owner?.lastName}
                  </h5>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                  <p className="ml-3">{rentDetail?.owner?.phoneNumber}</p>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                  <p className="overflow-auto">{rentDetail?.owner?.email}</p>
                </div>
              </div>
            </CardActionArea>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RentDetailTenantPage;