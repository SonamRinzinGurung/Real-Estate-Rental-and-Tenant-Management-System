import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRealEstateDetail } from "../../features/realEstateOwner/realEstateOwnerSlice";
import { PageLoading, Footer, ImageCarousal } from "../../components";
import { format, dateFormatter } from "../../utils/valueFormatter";
import { Button } from "@mui/material";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GavelIcon from "@mui/icons-material/Gavel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArticleIcon from "@mui/icons-material/Article";

const PersonalRealEstateDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getRealEstateDetail({ slug }));
  }, [slug, dispatch]);

  const { realEstate, isLoading } = useSelector(
    (store) => store.realEstateOwner
  );

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
              {/* Render the edit and create contract if the real estate property is available for rental */}
              {realEstate?.status === true ? (
                <div className="flex flex-wrap gap-2 mt-2 text-center">
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ color: "#fff" }}
                    size="small"
                    onClick={() => {
                      navigate(`/owner/real-estate/update/${slug}`);
                    }}
                    startIcon={<BorderColorIcon />}
                  >
                    Edit
                  </Button>
                  <Link
                    to={`/owner/contract/create`}
                    state={{
                      realEstateId: realEstate?._id,
                      title: realEstate?.title,
                      price: realEstate?.price,
                      slug: slug,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ color: "#fff" }}
                      size="small"
                      startIcon={<GavelIcon />}
                    >
                      Create Contract
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="">
                  <Link to={`/owner/contract/${realEstate?._id}/${slug}`}>
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
                </div>
              )}
            </div>
          </section>
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

export default PersonalRealEstateDetail;
