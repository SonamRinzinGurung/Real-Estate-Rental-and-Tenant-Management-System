import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSingleRentDetailOwnerView } from "../../features/rentDetail/rentDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, Footer, ImageCarousal } from "../../components";
import { CardActionArea, Avatar } from "@mui/material";
import { dateFormatter, format } from "../../utils/valueFormatter";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";

const SingleRentDetail = () => {
  const dispatch = useDispatch();
  const { rentDetailId } = useParams();

  const { isLoading, rentDetail } = useSelector((state) => state.rentDetail);

  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return <h1 className="mt-6 text-center">Rent Detail Not Found</h1>;

  return (
    <>
      <main className="mb-12 mt-10 mx-12">
        <h3 className="mb-4 font-heading font-bold ml-12">Rent Detail</h3>
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
              <p className="font-roboto text-gray-500">
                {rentDetail?.realEstate?.category}
              </p>
              <p className="-ml-1 text-base tracking-tight">
                <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                {rentDetail?.realEstate?.address?.location},{" "}
                {rentDetail?.realEstate?.address?.streetName} ,Kathmandu
              </p>
              <div className="">
                <p className="font-robotoNormal text-xs font-semibold tracking-tight">
                  Posted on: {dateFormatter(rentDetail?.realEstate?.createdAt)}
                </p>
              </div>
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
                <span className="font-medium">Start Date:</span>{" "}
                {dateFormatter(rentDetail?.startDate)}
              </p>
            </div>
          </div>
        </section>
        <div className="mt-6">
          <Link to={`/owner/tenant-user/${rentDetail?.tenant?.slug}`}>
            <CardActionArea sx={{ borderRadius: "0.375rem" }}>
              <div className="p-4 shadow-lg rounded-md">
                <div className="flex gap-2 items-center">
                  <h4 className="font-medium">Tenant Info</h4>
                  <ContactsRoundedIcon color="secondary" />
                </div>
                <div className="flex mt-4 gap-2 items-center">
                  <Avatar
                    src={rentDetail?.tenant?.profileImage}
                    alt={(rentDetail?.tenant?.firstName).toUpperCase()}
                  />
                  <h5 className="leading-4 font-serif">
                    {rentDetail?.tenant?.firstName}{" "}
                    {rentDetail?.tenant?.lastName}
                  </h5>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                  <p className="ml-3">{rentDetail?.tenant?.phoneNumber}</p>
                </div>
                <div className="flex mt-2 ml-1 gap-2 items-center">
                  <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                  <p className="">{rentDetail?.tenant?.email}</p>
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

export default SingleRentDetail;
