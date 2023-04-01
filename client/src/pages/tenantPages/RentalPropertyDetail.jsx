import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSingleRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { PageLoading, Footer, ImageCarousal } from "../../components";
import { format, dateFormatter } from "../../utils/valueFormatter";
import { CardActionArea, Avatar, Button } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MailIcon from "@mui/icons-material/Mail";

const RentalPropertyDetail = () => {
  const { realEstate, isLoading } = useSelector(
    (state) => state.realEstateTenant
  );

  const dispatch = useDispatch();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getSingleRealEstate({ slug }));
  }, [slug, dispatch]);

  if (isLoading) return <PageLoading />;

  if (!realEstate)
    return <h1 className="mt-6 text-center">No real estate found</h1>;

  return (
    <>
      <main className="mb-12 mt-10 mx-4 md:mx-12">
        <div className="flex flex-col gap-4 mx-auto">
          <h3 className="font-heading font-bold">Rental Property Detail</h3>
          <section className="flex flex-col gap-12 rounded-md md:flex-row">
            <div className="w-full md:w-2/3">
              <ImageCarousal realEstateImages={realEstate?.realEstateImages} />
            </div>
            <div className="flex flex-col rounded-md gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{realEstate?.title}</h3>
                <div>
                  <p className="font-roboto text-gray-500">
                    {realEstate?.category}
                  </p>
                </div>
                <p className="-ml-1 text-base tracking-tight">
                  <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
                  {realEstate?.address?.location},{" "}
                  {realEstate?.address?.streetName} ,Kathmandu
                </p>
                <div className="">
                  <p className="font-robotoNormal text-xs font-semibold tracking-tight">
                    Posted on: {dateFormatter(realEstate?.createdAt)}
                  </p>
                  <p className="font-robotoNormal text-xs tracking-tight">
                    Id: {realEstate?.propertyId}
                  </p>
                </div>
              </div>
              <div className="">
                <div className="rounded-md">
                  <p className="font-roboto text-primaryDark leading-4 ">
                    RENT per month
                  </p>
                  <span className="font-semibold text-lg text-primaryDark">
                    NPR. {format(realEstate?.price)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <Link to={`/tenant/contract/${realEstate?._id}/${slug}`}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ color: "#fff" }}
                    startIcon={<ArticleIcon />}
                  >
                    View Contract
                  </Button>
                </Link>
                <Link
                  to={`/tenant/rentDetail/${realEstate?._id + "/" + slug}`}
                  state={{ realEstateId: realEstate?._id }}
                >
                  <Button
                    variant="contained"
                    color="tertiary"
                    size="small"
                    sx={{ color: "#fff" }}
                    startIcon={<MapsHomeWorkIcon />}
                  >
                    Rent Detail
                  </Button>
                </Link>
                <Link to={`/tenant/send-complaint/${slug}`}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ color: "#fff" }}
                    startIcon={<MailIcon />}
                  >
                    Send Complaint
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          <article className="mt-2">
            <Link to={`/tenant/owner-user/${realEstate?.propertyOwner?.slug}`}>
              <CardActionArea sx={{ borderRadius: "6px" }}>
                <div className="shadow-lg rounded-md p-4">
                  <div className="flex gap-2 items-center">
                    <h4 className="font-medium">Contact Info</h4>
                    <ContactsRoundedIcon color="secondary" />
                  </div>
                  <div className="flex mt-4 gap-2 items-center">
                    <Avatar
                      src={realEstate?.propertyOwner?.profileImage}
                      alt={(realEstate?.propertyOwner?.firstName).toUpperCase()}
                    />
                    <p className="leading-4">
                      {realEstate?.propertyOwner?.firstName}{" "}
                      {realEstate?.propertyOwner?.lastName}
                    </p>
                  </div>
                  <div className="flex mt-2 ml-1 gap-2 items-center">
                    <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                    <p className="ml-3">
                      {realEstate?.propertyOwner?.phoneNumber}
                    </p>
                  </div>
                  <div className="flex mt-2 ml-1 gap-2 items-center">
                    <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                    <p className="overflow-auto">
                      {realEstate?.propertyOwner?.email}
                    </p>
                  </div>
                </div>
              </CardActionArea>
            </Link>
          </article>
          <div className="">
            <h3 className="font-semibold p-3">Description</h3>
            <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
            <p className="text-lg p-3 tracking-normal">
              {realEstate?.description}
            </p>
          </div>
          <div className="">
            <h3 className="font-semibold p-3">Overview</h3>
            <hr className="w-3/4 ml-3 border-t-2 rounded-md" />
            <div className="flex flex-wrap">
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <SquareFootRoundedIcon sx={{ color: "#738FA7" }} />
                </span>
                <span className="font-semibold"> Area of Property </span>
                <p className="">{format(realEstate?.area)} sq. feet</p>
              </div>
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <HorizontalSplitRoundedIcon />
                </span>
                <span className="font-semibold">
                  Number of {realEstate?.floors > 1 ? "floors" : "floor"}
                </span>
                <p className="">{format(realEstate?.floors)} </p>
              </div>
              <div className="flex p-3 mt-2 gap-2 items-center">
                <span>
                  <ExploreRoundedIcon sx={{ color: "#29b46e" }} />
                </span>
                <span className="font-semibold"> Property Facing </span>
                <p className="">{realEstate?.facing}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RentalPropertyDetail;
