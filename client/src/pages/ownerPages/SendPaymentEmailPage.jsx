import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleRentDetailOwnerView,
  sendPaymentEmailToTenant,
  clearAlert,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal, AlertToast } from "../../components";
import { Button, CircularProgress } from "@mui/material";
import {
  dateFormatter,
  format,
  calculateTotalRent,
  calculateNumberOfMonths,
} from "../../utils/valueFormatter";
import ForwardToInboxRoundedIcon from "@mui/icons-material/ForwardToInboxRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const SendPaymentEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rentDetailId } = useParams();

  const {
    isLoading,
    rentDetail,
    isProcessing,
    alertFlag,
    alertMsg,
    alertType,
    success,
  } = useSelector((state) => state.rentDetailOwner);

  useEffect(() => {
    dispatch(getSingleRentDetailOwnerView({ rentDetailId }));
  }, [dispatch, rentDetailId]);

  // Redirect to detail page of the property after successful contract creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(
          `/owner/rentDetail/${rentDetailId}/${rentDetail?.realEstate.slug}`
        );
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, rentDetailId, rentDetail?.realEstate.slug]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  //modal state and handlers
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formValues, setFormData] = useState({});

  const handleSendConfirmation = (e) => {
    e.preventDefault();

    const emailTemplate = {
      to: rentDetail?.tenant?.email,
      from: rentDetail?.owner?.email,
      subject: `${calculateNumberOfMonths(
        rentDetail?.paymentPlan
      )} rental payment of Property: ${rentDetail?.realEstate?.title}`,
      body: `
      <p>
      Dear ${rentDetail?.tenant?.firstName} ${rentDetail?.tenant?.lastName},</p>
              <p>
                I hope this email finds you well. This is a friendly reminder that your ${calculateNumberOfMonths(
                  rentDetail?.paymentPlan
                )} rent payment for the dates from ${dateFormatter(
        rentDetail?.currentRentDate.from
      )} to ${dateFormatter(
        rentDetail?.currentRentDate.to
      )} is due. As per our rental agreement, rent is to be paid within 7 days after ${dateFormatter(
        rentDetail?.currentRentDate.from
      )}. The total rent amount is NPR ${format(
        calculateTotalRent(
          rentDetail?.paymentPlan,
          rentDetail?.realEstate.price
        )
      )} for NPR ${format(rentDetail?.realEstate?.price)} per month.
              </p>
              <p>
                Please note that late payment fees may apply if the rent is not
                paid by the due date. If you have any questions or concerns,
                please do not hesitate to contact me. Thank you for your
                cooperation. Kindly contact me at ${rentDetail?.owner?.email} or
                +977 ${rentDetail?.owner?.phoneNumber}.
              </p>
              <p>
                Real Estate Title: <b>${rentDetail?.realEstate?.title}</b>
                <br />
                Number of Months: <b>${calculateNumberOfMonths(
                  rentDetail?.paymentPlan
                )}</b> <br />
                Rent Amount: <b>NPR ${format(
                  calculateTotalRent(
                    rentDetail?.paymentPlan,
                    rentDetail?.realEstate.price
                  )
                )}</b> <br />
                Rent Due Date: <b>${dateFormatter(
                  rentDetail?.currentRentDate.from
                )}</b>
                <br />
              </p>
              <p>Best regards,</p>
              <p>
                ${rentDetail?.owner?.firstName} ${rentDetail?.owner?.lastName}
              </p>
      `,
    };

    setFormData(emailTemplate);
    handleModalOpen();
  };

  const handleEmailSend = useCallback(() => {
    dispatch(sendPaymentEmailToTenant({ formValues }));
    handleModalClose();
  }, [dispatch, formValues, handleModalClose]);

  if (isLoading) return <PageLoading />;
  if (!rentDetail)
    return <h1 className="mt-6 text-center">Rent Detail Not Found</h1>;

  return (
    <main className="mt-10 mb-12 mx-8 md:mx-12">
      <div className="flex gap-2">
        <h4 className="mb-4 font-heading font-bold">Send Email</h4>
        <ForwardToInboxRoundedIcon color="tertiary" />
      </div>
      <div className=" shadow-lg rounded-md p-4  overflow-auto">
        <form onSubmit={handleSendConfirmation}>
          <div className="flex mt-4 gap-2 items-center">
            <span className="font-semibold"> To: </span>
            <p className="">{rentDetail?.tenant?.email}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <span className="font-semibold"> From: </span>
            <p className="">{rentDetail?.owner?.email}</p>
          </div>
          <div className="flex mt-2 gap-2 items-center">
            <span className="font-semibold"> Subject: </span>
            <p>
              {calculateNumberOfMonths(rentDetail?.paymentPlan)} rental payment
              of Property: <b>{rentDetail?.realEstate?.title}</b>
            </p>
          </div>
          <div className="flex mt-2 gap-2 items-start">
            <span className="font-semibold"> Body: </span>
            <div className="text-sm mt-1">
              <p>
                Dear {rentDetail?.tenant?.firstName}{" "}
                {rentDetail?.tenant?.lastName},
              </p>
              <br />
              <p>
                I hope this email finds you well. This is a friendly reminder
                that your {calculateNumberOfMonths(rentDetail?.paymentPlan)}{" "}
                rent payment for the dates from{" "}
                {dateFormatter(rentDetail?.currentRentDate.from)} to{" "}
                {dateFormatter(rentDetail?.currentRentDate.to)} is due. As per
                our rental agreement, rent is to be paid within 7 days after{" "}
                {dateFormatter(rentDetail?.currentRentDate.from)}. The total
                rent amount is NPR{" "}
                {format(
                  calculateTotalRent(
                    rentDetail?.paymentPlan,
                    rentDetail?.realEstate.price
                  )
                )}{" "}
                for NPR {format(rentDetail?.realEstate?.price)} per month.
              </p>
              <br />
              <p>
                Please note that late payment fees may apply if the rent is not
                paid by the due date. If you have any questions or concerns,
                please do not hesitate to contact me. Thank you for your
                cooperation. Kindly contact me at {rentDetail?.owner?.email} or
                +977 {rentDetail?.owner?.phoneNumber}.
              </p>
              <br />
              <p>
                Real Estate Title: <b>{rentDetail?.realEstate?.title}</b>
                <br />
                Number of Months:{" "}
                <b>{calculateNumberOfMonths(rentDetail?.paymentPlan)}</b> <br />
                Rent Amount:{" "}
                <b>
                  NPR{" "}
                  {format(
                    calculateTotalRent(
                      rentDetail?.paymentPlan,
                      rentDetail?.realEstate.price
                    )
                  )}
                </b>{" "}
                <br />
                Rent Due Date:{" "}
                <b>{dateFormatter(rentDetail?.currentRentDate.from)}</b> <br />
                <br />
              </p>
              <p>Best regards,</p>
              <p>
                {rentDetail?.owner?.firstName} {rentDetail?.owner?.lastName}
              </p>
            </div>
          </div>
          <div className="flex mt-2 gap-2 justify-end py-2">
            <Button
              disabled={isProcessing}
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
        <h3 className="text-center">Send Email</h3>
        <p className="text-center my-4">
          Are you sure you want to send this email?
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

export default SendPaymentEmailPage;
