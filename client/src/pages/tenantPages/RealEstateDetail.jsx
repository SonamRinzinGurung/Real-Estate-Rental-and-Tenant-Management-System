import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getSingleRealEstate,
  clearAlert,
  sendEmailToOwner,
} from "../../features/realEstateTenant/realEstateTenantSlice";
import {
  RealEstateDetailCard,
  PageLoading,
  Footer,
  AlertToast,
  ConfirmModal,
} from "../../components";
import { format } from "../../utils/valueFormatter";
import {
  Button,
  CardActionArea,
  Avatar,
  CircularProgress,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import ContactsRoundedIcon from "@mui/icons-material/ContactsRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import HorizontalSplitRoundedIcon from "@mui/icons-material/HorizontalSplitRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const RealEstateDetail = () => {
  const {
    realEstate,
    isLoading,
    alertFlag,
    alertMsg,
    alertType,
    isSaved,
    isProcessing,
  } = useSelector((state) => state.realEstateTenant);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { slug } = useParams();

  useEffect(() => {
    dispatch(getSingleRealEstate({ slug }));
  }, [slug, dispatch]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formValues, setFormData] = useState({});

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: realEstate?.propertyOwner?.email,
      from: user?.email,
      subject: `Rental of Property with ID: ${realEstate?.propertyId}`,
      body: `<p>Hi ${realEstate?.propertyOwner?.firstName} ${realEstate?.propertyOwner?.lastName},</p>
      <p>I am interested in renting your property titled <strong>${realEstate?.title}</strong> with ID: ${realEstate?.propertyId}.</p>
      <p>Kindly contact me at ${user?.email} or +977 ${user?.phoneNumber}.</p>
      <p>Visit my profile <a href="${process.env.REACT_APP_BASE_URL}/owner/tenant-user/${user?.slug}"><strong>${user?.firstName} ${user?.lastName}</strong></a>.</p>
      <br><br>
      <p>Thank you,</p>
      <p>${user?.firstName} ${user?.lastName},</p>
      <p>${user.address}</p>`,
    };

    setFormData(emailTemplate);
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendEmailToOwner({ formValues }));
    handleModalClose();
  }, [dispatch, formValues, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!realEstate)
    return <h1 className="mt-6 text-center">No real estate found</h1>;

  return (
    <>
      <main className="flex gap-2 flex-col mb-12 lg:flex-row">
        <div className="flex flex-col gap-8 mt-10 mx-auto p-4 lg:w-8/12 lg:ml-14">
          <RealEstateDetailCard
            {...realEstate}
            fromTenant
            isSaved={isSaved}
            isProcessing={isProcessing}
          />

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
        <aside className="mx-4 my-10 p-4 lg:w-1/3 lg:mr-14">
          <Link to={`/tenant/owner-user/${realEstate?.propertyOwner?.slug}`}>
            <CardActionArea sx={{ borderRadius: "0.375rem" }}>
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
          <div className="mt-8 shadow-lg rounded-md p-4">
            <form className="overflow-x-auto" onSubmit={handleSendConfirmation}>
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
                  Rental of Property with ID:{" "}
                  <span className="text-sm">{realEstate?.propertyId}</span>
                </p>
              </div>
              <div className="flex mt-2 gap-2 items-start">
                <span className="font-semibold"> Body: </span>
                <div className="text-sm mt-1">
                  <p>
                    Hi {realEstate?.propertyOwner?.firstName}{" "}
                    {realEstate?.propertyOwner?.lastName},
                  </p>
                  <br />
                  <p>
                    I am interested in renting your property titled{" "}
                    <strong>{realEstate?.title}</strong> with ID:{" "}
                    {realEstate?.propertyId}.
                  </p>
                  <p>
                    Kindly contact me at {user?.email} or +977{" "}
                    {user?.phoneNumber}.
                  </p>
                  <p>
                    Visit my profile at{" "}
                    <strong>
                      {user?.firstName} {user?.lastName}
                    </strong>
                    .
                  </p>

                  <br />
                  <p>Thank you,</p>
                  <p>
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex mt-2 gap-2 justify-end py-2">
                <Button
                  type="submit"
                  variant="contained"
                  color="tertiary"
                  sx={{ color: "#fff" }}
                  size="small"
                  startIcon={<SendRoundedIcon />}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <CircularProgress
                      size={26}
                      sx={{
                        color: "#fff",
                        width: "25%",
                      }}
                    />
                  ) : (
                    "Send Email"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </aside>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Send Email</h3>
          <p className="text-center my-4">
            Are you sure you want to send this email?
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="error">
              Close
            </Button>

            <Button
              onClick={handleEmailSend}
              color="success"
              variant="contained"
            >
              Confirm
            </Button>
          </div>
        </ConfirmModal>
        <AlertToast
          alertFlag={alertFlag}
          alertMsg={alertMsg}
          alertType={alertType}
          handleClose={handleAlertClose}
        />
      </main>
      <Footer />
    </>
  );
};

export default RealEstateDetail;
