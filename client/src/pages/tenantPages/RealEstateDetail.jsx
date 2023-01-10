import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSingleRealEstate,
  clearAlert,
} from "../../features/realEstateTenant/realEstateTenantSlice";
import {
  RealEstateDetailCard,
  PageLoading,
  Footer,
  AlertToast,
} from "../../components";
import { format } from "../../utils/valueFormatter";
import { Button, CardActionArea } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import Avatar from "@mui/material/Avatar";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";

const RealEstateDetail = () => {
  const { realEstate, isLoading, alertFlag, alertMsg, alertType, isSaved } =
    useSelector((state) => state.realEstateTenant);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getSingleRealEstate({ slug }));
  }, [slug, dispatch]);

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  if (isLoading) return <PageLoading />;

  return (
    <>
      <main className="flex gap-2 flex-col mb-12 lg:flex-row">
        <div className="flex flex-col gap-8 mt-10 mx-auto p-4 w-4/6 lg:ml-14">
          <RealEstateDetailCard {...realEstate} fromTenant isSaved={isSaved} />

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
        <aside className="mx-auto my-10 p-4 w-4/6 lg:w-1/3 lg:mr-14">
          <CardActionArea href={`#`}>
            <div className="shadow-lg rounded-md p-4">
              <div className="flex gap-2 items-center">
                <h4 className="font-medium">Contact Info</h4>
                <ContactsRoundedIcon color="secondary" />
              </div>
              <div className="flex mt-4 gap-2 items-center">
                <Avatar src={realEstate?.propertyOwner?.profileImage} />
                <p className="leading-4">
                  {realEstate?.propertyOwner?.firstName}{" "}
                  {realEstate?.propertyOwner?.lastName}
                </p>
              </div>
              <div className="flex mt-2 ml-1 gap-2 items-center">
                <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                <p className="ml-3">{realEstate?.propertyOwner?.phoneNumber}</p>
              </div>
              <div className="flex mt-2 ml-1 gap-2 items-center">
                <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                <p className="">{realEstate?.propertyOwner?.email}</p>
              </div>
            </div>
          </CardActionArea>

          <div className="mt-8 shadow-lg rounded-md p-4">
            <div className="flex gap-2 items-center">
              <h4 className="font-medium">Send Email</h4>
              <ForwardToInboxRoundedIcon color="tertiary" />
            </div>
            <div className="flex mt-4 gap-2 items-center">
              <span className="font-semibold"> To: </span>
              <p className="">{realEstate?.propertyOwner?.email}</p>
            </div>
            <div className="flex mt-2 gap-2 items-center">
              <span className="font-semibold"> From: </span>
              <p className="">{user?.email}</p>
            </div>
            <div className="flex mt-2 gap-2 items-center">
              <span className="font-semibold"> Subject: </span>
              <p>
                Rental of Property{" "}
                <span className="text-sm">{realEstate?.propertyId}</span>
              </p>
            </div>
            <div className="flex mt-2 gap-2 items-start">
              <span className="font-semibold"> Body: </span>
              <p className="text-sm">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum
                sed consequatur consectetur praesentium cumque quam nobis illo
                quod molestias enim?
              </p>
            </div>
            <div className="flex mt-2 gap-2 justify-end py-2">
              <Button
                variant="contained"
                color="tertiary"
                sx={{ color: "#fff" }}
              >
                Send Email
              </Button>
            </div>
          </div>
        </aside>
        <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleClose}
        />
      </main>
      <Footer />
    </>
  );
};

export default RealEstateDetail;
