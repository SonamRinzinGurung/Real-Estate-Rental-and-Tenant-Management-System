import { useState, useEffect, useCallback } from "react";
import {
  getLeaseOwnerView,
  clearAlert,
  deleteLease,
  terminatePendingLease,
} from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageLoading, ConfirmModal } from "../../components";
import { Button, CircularProgress } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import {
  createNumberFormatter,
  dateFormatter,
} from "../../utils/valueFormatter";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import useToast from "../../hooks/useToast";

const LeaseDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { realEstateId } = useParams();

  const {
    leaseDetail,
    isLoading,
    isProcessing,
    alertFlag,
    alertType,
    alertMsg,
    success,
  } = useSelector((state) => state.ownerUser);

  useToast({
    alertFlag,
    alertType,
    message: alertMsg,
    clearAlertAction: clearAlert,
  });

  useEffect(() => {
    dispatch(getLeaseOwnerView({ realEstateId }));
  }, [dispatch, realEstateId]);

  // Redirect to detail page of the property after lease is deleted
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${leaseDetail?.realEstate?.slug}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, leaseDetail?.realEstate?.slug]);

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const currentCountry = countries.find(
    (country) => country.label === leaseDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  const handleTerminateLease = useCallback(() => {
    dispatch(terminatePendingLease({ leaseId: leaseDetail?._id }));
    handleModalClose();
  }, [dispatch, leaseDetail?._id, handleModalClose]);

  const handleDeleteLease = useCallback(() => {
    dispatch(deleteLease({ leaseId: leaseDetail?._id }));
    handleModalClose();
  }, [dispatch, leaseDetail?._id, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!leaseDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Lease Does not Exists!</h1>
      </div>
    );

  return (
    <main className="mb-12">
      <h3 className="my-4 font-heading font-bold text-center">
        Lease Detail
      </h3>
      <div className="flex flex-col w-11/12 mx-auto items-center gap-4 sm:flex-row sm:justify-center sm:items-start">
        <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
          <h4 className="font-bold">Real Estate</h4>
          <Link to={`/owner/real-estate/${leaseDetail?.realEstate?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {leaseDetail?.realEstate?.title}
            </h5>
          </Link>
          <p>{leaseDetail?.realEstate?.category}</p>
          <p className="">
            <LocationOnOutlinedIcon color="success" />{" "}
            {leaseDetail?.realEstate?.address.streetName},{" "}
            {leaseDetail?.realEstate?.address.city},{" "}
            {leaseDetail?.realEstate?.address.state},{" "}
            {leaseDetail?.realEstate?.address?.country}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
          <h4 className="font-bold">Tenant User</h4>
          <Link to={`/owner/tenant-user/${leaseDetail?.tenant?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {leaseDetail?.tenant?.firstName}{" "}
              {leaseDetail?.tenant?.lastName}
            </h5>
          </Link>
          <div className="flex gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="">{leaseDetail?.tenant?.phoneNumber}</p>
          </div>
          <div className="flex gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="lowercase overflow-clip">
              {leaseDetail?.tenant?.email}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center mt-4 text-center">
        <h4 className="font-bold">Lease Details</h4>
        <div>
          <h5 className="font-robotoNormal">
            <span className="font-medium">Lease Start Date</span>:{" "}
            {dateFormatter(leaseDetail?.startDate)}
          </h5>
        </div>
        <div>
          <h5 className="font-robotoNormal">
            <span className="font-medium">Payment Plan</span>:{" "}
            {leaseDetail?.paymentPlan}
          </h5>
        </div>
        <div>
          <h5 className="font-robotoNormal">
            <span className="font-medium">Rent Amount</span>:{" "}
            {countryToCurrency[currentCountry.code]}{" "}
            {format(leaseDetail?.realEstate?.price)} per month
          </h5>
        </div>
      </div>

      <div className="w-11/12 mx-auto text-justify mt-6">
        <h4>Rental Agreement Lease</h4>
        <p>
          This Rental Agreement Lease is applicable from{" "}
          <strong>{dateFormatter(leaseDetail?.startDate)}</strong>, created
          by the property owner{" "}
          <strong>
            {leaseDetail?.owner?.firstName} {leaseDetail?.owner?.lastName}
          </strong>
          , for the rental of the property located at{" "}
          <strong>
            {leaseDetail?.realEstate?.address?.location},{" "}
            {leaseDetail?.realEstate?.address?.streetName}
          </strong>{" "}
          with the tenant{" "}
          <strong>
            {leaseDetail?.tenant?.firstName}{" "}
            {leaseDetail?.tenant?.lastName}
          </strong>
          .
        </p>
        <br />
        <h5>1. Payment of Rent</h5>
        <p>
          Tenant shall pay rent in the amount of{" "}
          <strong>
            {countryToCurrency[currentCountry.code]}{" "}
            {format(leaseDetail?.realEstate?.price)}
          </strong>{" "}
          per month. Total Rent amount of{" "}
          <strong>
            {countryToCurrency[currentCountry.code]}{" "}
            {format(leaseDetail?.rentAmount)}
          </strong>{" "}
          shall be due and payable{" "}
          <strong>{leaseDetail?.paymentPlan}</strong> on the first day of the
          calendar month and shall be considered late if not received by the
          Landlord on or before the 7th day of the month.
        </p>
        <br />
        <h5>2. Late Fees</h5>
        <p>
          If rent is not received by the 7th day of the month, a late fee of 5%
          shall be added to the total amount due.
        </p>
        <br />
        <h5>3. Termination of Agreement</h5>
        <p>
          The Landlord may terminate this Agreement if rent is more than 30 days
          late. In such event, Tenant shall vacate the Property immediately.
        </p>
        <br />
        <h5>4. Entire Agreement</h5>
        <p>
          This Agreement constitutes the entire agreement between the parties
          and supersedes all prior negotiations, understandings, and agreements
          between the parties, whether written or oral.
        </p>
        <br />
        <h5>5. Amendments</h5>
        <p>
          This Agreement may only be amended by written instrument executed by
          both parties.
        </p>
        <br />
        <h5>6. Governing Law</h5>
        <p>
          This Agreement shall be governed by and construed in accordance with
          the laws of the state in which the Property is located.
        </p>
        <br />
        <h5>7. Assignment and Binding Effect</h5>
        <p>
          Tenant shall not assign this Agreement or sublease the Property
          without the prior written consent of the Landlord. This Agreement
          shall be binding upon and inure to the benefit of both parties, their
          heirs, legal representatives, successors, and assigns.
        </p>
        <br />
      </div>

      <div className="w-11/12 mx-auto text-justify mt-6">
        <h4>Digital Signature</h4>
        <p className="font-robotoNormal">Signed By: <strong>{leaseDetail?.digitalSignature}</strong></p>
        <p className="font-robotoNormal">Date: {dateFormatter(leaseDetail?.leaseSignTime)}</p>
      </div>

      {leaseDetail?.status === "Active" && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <CheckCircleRoundedIcon color="success" />
          <p className="font-bold">Active Lease</p>
        </div>
      )}
      {leaseDetail?.status === "Terminated-pending" && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <RemoveCircleRoundedIcon color="error" />
          <p className="font-bold">Terminated (Pending Approval)</p>
        </div>
      )}

      {leaseDetail?.status === "Terminated-approved" && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <RemoveCircleRoundedIcon color="error" />
          <p className="font-bold">Terminated (Approved)</p>
        </div>
      )}

      {
        (leaseDetail?.status === "Active" || leaseDetail?.status === "Terminated-approved") && (

          <div className="flex justify-center mt-6">
        <Button
          onClick={handleModalOpen}
          variant="contained"
          size="medium"
          color="error"
          sx={{ color: "#fff" }}
          disabled={isProcessing || (alertFlag && alertType === "success")}
          startIcon={<RemoveCircleRoundedIcon />}
            >
          {isProcessing ? (
            <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
            />
          ) : (
                  <>{leaseDetail?.status === "Active" ? "Terminate Lease" : "Delete Lease"}</>
          )}
        </Button>
      </div>
        )}

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">{leaseDetail?.status === "Active" ? "Terminate Lease" : "Delete Lease"}</h3>
          <p className="text-center my-4">
            {leaseDetail?.status === "Active" ? 'Are you sure you want to terminate this lease? This action will change the lease status to "Terminated-pending" and the tenant user will be notified to approve the termination.' : "Are you sure you want to delete this lease? This action is irreversible. This will also delete the associated Rent Details and Payment Records."}

          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="warning">
              Close
            </Button>

            <Button
              onClick={leaseDetail?.status === "Active" ? handleTerminateLease : handleDeleteLease}
              color="error"
              variant="contained"
            >
              {leaseDetail?.status === "Active" ? "Terminate" : "Delete"}
            </Button>
          </div>
        </ConfirmModal>
      </div>
    </main>
  );
};

export default LeaseDetailPage;
