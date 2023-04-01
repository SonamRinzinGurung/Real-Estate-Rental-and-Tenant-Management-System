import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleRealEstate,
  sendComplaintToOwner,
  clearAlert,
} from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal, AlertToast } from "../../components";
import { Button, CircularProgress, TextField } from "@mui/material";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const SendComplaint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();

  const {
    isLoading,
    realEstate,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    success,
  } = useSelector((state) => state.realEstateTenant);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSingleRealEstate({ slug }));
  }, [slug, dispatch]);

  // Redirect to detail page of the property after successful contract creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/tenant/rental-properties/${slug}`);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const initialFormValues = {
    to: "",
    from: "",
    subject: "",
    body: "",
    message: "",
  };

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...formValues, [e.target.name]: e.target.value });
    },
    [formValues]
  );

  //modal state and handlers
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: realEstate?.propertyOwner?.email,
      from: user?.email,
      body: `
        <p> Dear ${realEstate?.propertyOwner?.firstName} ${realEstate?.propertyOwner?.lastName},</p>
        <p>${formValues.message}</p><br />
        <p>Best Regards,</p>
        <p>${user?.firstName} ${user?.lastName}</p>
      `,
    };

    setFormValues({ ...formValues, ...emailTemplate });
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendComplaintToOwner({ formValues }));
    handleModalClose();
  }, [dispatch, formValues, handleModalClose]);

  if (isLoading) return <PageLoading />;
  if (!realEstate)
    return (
      <h1 className="mt-6 text-center">Email Credential Values Not Found</h1>
    );

  return (
    <main className="mt-10 mb-12 mx-8 md:mx-12">
      <div className="flex gap-2 mb-4">
        <h4 className="font-heading font-bold">Send Email Complaint</h4>
        <ForwardToInboxRoundedIcon color="tertiary" />
      </div>
      <div className="shadow-lg rounded-md p-8 overflow-auto">
        <form onSubmit={handleSendConfirmation}>
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
            <div className="w-full">
              <TextField
                required
                multiline
                variant="standard"
                rows={1}
                color="tertiary"
                placeholder="Write your subject here"
                name="subject"
                value={formValues.subject}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="flex mt-2 gap-2 items-start">
            <span className="font-semibold"> Body: </span>
            <div className="text-sm mt-1 w-full">
              <p>
                Dear {realEstate?.propertyOwner?.firstName}{" "}
                {realEstate?.propertyOwner?.lastName},
              </p>
              <br />
              <div>
                <TextField
                  required
                  multiline
                  variant="standard"
                  rows={8}
                  color="tertiary"
                  placeholder="Write your message here"
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </div>
              <p>Best regards,</p>
              <p>
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="flex mt-2 gap-2 justify-end py-2">
            <Button
              disabled={isProcessing || (alertFlag && alertType === "success")}
              type="submit"
              variant="contained"
              color="tertiary"
              sx={{ color: "#fff" }}
              startIcon={<SendRoundedIcon />}
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
      <ConfirmModal open={open} handleModalClose={handleModalClose}>
        <h3 className="text-center">Send Complaint Email</h3>
        <p className="text-center my-4">
          Are you sure you want to send this complaint email?
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="error">
            Close
          </Button>

          <Button onClick={handleEmailSend} color="success" variant="contained">
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
  );
};

export default SendComplaint;
