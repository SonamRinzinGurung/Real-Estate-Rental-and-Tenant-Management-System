import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOwnerUserDetails,
  addOrRemoveContact as addOrRemoveTenantContact,
  // clearAlert as clearTenantAlert,
} from "../features/tenantUser/tenantUserSlice";
import {
  getTenantUserDetails,
  addOrRemoveContact as addOrRemoveOwnerContact,
  // clearAlert,
} from "../features/ownerUser/ownerUserSlice";

import { useParams, useNavigate } from "react-router-dom";
import { Footer, PageLoading, AlertToast } from "../components";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Button } from "@mui/material";
import ContactPageRoundedIcon from "@mui/icons-material/ContactPageRounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import CircularProgress from "@mui/material/CircularProgress";
import ImageViewer from "react-simple-image-viewer";
import MessageIcon from "@mui/icons-material/Message";
import { RealEstateCard } from "../components";

const UserDetailPage = ({ userType }) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isLoading,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    isContact,
    realEstates,
  } = useSelector((state) =>
    userType === "owner" ? state.ownerUser : state.tenantUser
  );

  useEffect(() => {
    if (userType === "tenant") {
      dispatch(getOwnerUserDetails({ slug }));
    } else {
      dispatch(getTenantUserDetails({ slug }));
    }
  }, [dispatch, slug, userType]);

  // const handleClose = useCallback(
  //   (event, reason) => {
  //     if (reason === "clickaway") {
  //       return;
  //     }
  //     dispatch(clearAlert());
  //   },
  //   [dispatch]
  // );

  const addOrRemoveContact = (id) => {
    if (userType === "tenant") {
      dispatch(addOrRemoveTenantContact({ id }));
    } else {
      dispatch(addOrRemoveOwnerContact({ id }));
    }
  }

  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback(() => {
    setIsViewerOpen(true);
  }, []);

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
        <div className="flex flex-col mt-10 mb-5 md:mb-12 md:w-1/4 items-center gap-3 md:ml-10">
          <h3 className="font-heading font-semibold text-4xl">Profile</h3>
          <div className="w-48 h-48 mt-6 cursor-pointer">
            <img
              src={user?.profileImage}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
              onClick={openImageViewer}
            />
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
          <p className="text-lg">
            {user?.firstName} {user?.lastName}
          </p>

          <div className="flex gap-2 items-center">
            <LocationOnOutlinedIcon sx={{ color: "#019149" }} />
            <p>{user?.address}</p>
          </div>
          <div className="flex gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="ml-3">+977 {user?.phoneNumber}</p>
          </div>
          <div className="flex gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="">{user?.email}</p>
          </div>
          <div className="flex gap-4 mt-4">

            {isContact ? (
            <Button
              disabled={isProcessing}
                onClick={() => addOrRemoveContact(user?._id)}
              variant="contained"
              color="error"
              startIcon={<PersonRemoveAlt1RoundedIcon />}
              size="small"
              sx={{
                color: "white",
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
                  onClick={() => addOrRemoveContact(user?._id)}
                  variant="contained"
                  color="secondary"
                  startIcon={<ContactPageRoundedIcon />}
                  size="small"
                  sx={{
                    color: "white",
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

          <div className="flex">
            <Button
              variant="contained"
              size="small"
              sx={{
                color: "white",
                width: "100%",
              }}
              startIcon={<MessageIcon />}
              onClick={() =>
                navigate(`/${userType}/chat`, {
                  state: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage,
                    slug: user.slug,
                  },
                })
              }
              >
              Chat
            </Button>
          </div>
        </div>
        </div>

        {userType === "tenant" && (
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
                      <RealEstateCard
                        key={item._id}
                        {...item}
                        fromUserProfile
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
        {/* <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleClose}
        /> */}
      </main>
      <Footer />
    </>
  );
};

export default UserDetailPage;
