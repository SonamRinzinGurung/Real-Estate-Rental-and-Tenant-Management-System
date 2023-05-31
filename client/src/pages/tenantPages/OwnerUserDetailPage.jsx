import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOwnerUserDetails,
  addOrRemoveContact,
  clearAlert,
} from "../../features/tenantUser/tenantUserSlice";
import { useParams } from "react-router-dom";
import {
  RealEstateCard,
  Footer,
  PageLoading,
  AlertToast,
} from "../../components";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ImageViewer from "react-simple-image-viewer";
import { Button } from "@mui/material";
import ContactPageRoundedIcon from "@mui/icons-material/ContactPageRounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import CircularProgress from "@mui/material/CircularProgress";

const OwnerUserDetailPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const {
    user,
    realEstates,
    isLoading,
    isContact,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
  } = useSelector((state) => state.tenantUser);

  useEffect(() => {
    dispatch(getOwnerUserDetails({ slug }));
  }, [dispatch, slug]);

  // close the alert
  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  // toggle open and close of ImageViewer
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // open the ImageViewer and set the currentImageIndex to the index of the image that was clicked
  const openImageViewer = useCallback((index) => {
    setIsViewerOpen(true);
  }, []);

  // close the ImageViewer
  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  if (isLoading) return <PageLoading />;

  if (!user)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>User Not found</h1>
      </div>
    );

  return (
    <>
      <main className="flex flex-col md:flex-row gap-8 md:items-start">
        <div className="flex flex-col mt-10 mb-5 md:mb-12 md:w-1/4 items-center gap-1 md:ml-10">
          <h3 className="font-heading font-semibold text-4xl">Profile</h3>
          <div className="w-48 h-48 mt-6 cursor-pointer">
            <img
              src={user?.profileImage}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
              onClick={() => openImageViewer(0)}
            />
            {/* Open and View the Image */}
            {isViewerOpen && (
              <ImageViewer
                src={[user?.profileImage]}
                currentIndex={0}
                onClose={closeImageViewer}
                disableScroll={false}
                backgroundStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                }}
                closeOnClickOutside={true}
              />
            )}
          </div>
          <p className="mt-2 text-lg">
            {user?.firstName} {user?.lastName}
          </p>

          <div className="flex mt-2 gap-2 items-center">
            <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
            <p>{user?.address}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="ml-3">+977 {user?.phoneNumber}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="">{user?.email}</p>
          </div>

          {isContact ? (
            <Button
              disabled={isProcessing}
              onClick={() => dispatch(addOrRemoveContact({ id: user?._id }))}
              variant="contained"
              color="error"
              startIcon={<PersonRemoveAlt1RoundedIcon />}
              size="medium"
              sx={{
                color: "white",
                marginTop: "12px",
              }}
            >
              {isProcessing ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                "Remove"
              )}
            </Button>
          ) : (
            <Button
              disabled={isProcessing}
              onClick={() => dispatch(addOrRemoveContact({ id: user?._id }))}
              variant="contained"
              color="secondary"
              startIcon={<ContactPageRoundedIcon />}
              size="medium"
              sx={{
                color: "white",
                marginTop: "12px",
              }}
            >
              {isProcessing ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                "Add"
              )}
            </Button>
          )}
        </div>
        <div className="mb-12 md:w-3/4 md:mt-10">
          {realEstates?.length === 0 ? (
            <div>
              <h4 className="text-center">No Real Estate Properties</h4>
            </div>
          ) : (
            <>
              <h3 className="text-center font-heading font-semibold text-4xl">
                {realEstates?.length > 1 ? "Properties" : "Property"}
              </h3>
              <div className="justify-center flex flex-wrap gap-8 mt-6 mx-4 md:mx-0">
                {realEstates?.map((item) => {
                  return (
                    <RealEstateCard key={item._id} {...item} fromUserProfile />
                  );
                })}
              </div>
            </>
          )}
        </div>
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

export default OwnerUserDetailPage;
