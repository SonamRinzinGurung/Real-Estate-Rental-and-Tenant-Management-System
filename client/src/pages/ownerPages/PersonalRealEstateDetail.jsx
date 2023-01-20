import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRealEstateDetail } from "../../features/realEstateOwner/realEstateOwnerSlice";
import { RealEstateDetailCard, PageLoading, Footer } from "../../components";
import { format } from "../../utils/valueFormatter";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";

const PersonalRealEstateDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRealEstateDetail({ slug }));
  }, [slug, dispatch]);

  const { realEstate, isLoading } = useSelector(
    (store) => store.realEstateOwner
  );

  if (isLoading) return <PageLoading />;

  return (
    <>
      <main className="mb-12">
        <div className="flex flex-col gap-8 mt-10 mx-auto p-4 lg:mx-14">
          <RealEstateDetailCard {...realEstate} fromOwner />

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
