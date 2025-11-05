import { useEffect, useCallback, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeaseWithRealEstateID,
  approveLeaseTermination,
  clearAlert,
} from "../../features/tenantUser/tenantUserSlice";
import { PageLoading, ConfirmModal } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import {
  createNumberFormatter,
  dateFormatter,
} from "../../utils/valueFormatter";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";
import { Button, CircularProgress } from "@mui/material";
import useToast from "../../hooks/useToast";

const LeaseDetailPageTenant = () => {
  const dispatch = useDispatch();
  const { realEstateId } = useParams();

  useEffect(() => {
    dispatch(getLeaseWithRealEstateID({ realEstateId }));
  }, [dispatch, realEstateId]);

  const {
    leaseDetail,
    isLoading,
    isProcessing,
    alertFlag,
    alertType,
    alertMsg,
  } = useSelector((state) => state.tenantUser);

  useToast({
    alertFlag,
    alertType,
    message: alertMsg,
    clearAlertAction: clearAlert,
  });

  const currentCountry = countries.find(
    (country) => country.label === leaseDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  // calculate the total rent amount according to payment plan
  const calculateTotalRent = useCallback(() => {
    const { paymentPlan, rentAmount } = leaseDetail;
    if (paymentPlan === "Monthly") return rentAmount;
    if (paymentPlan === "Every 2 Months") return rentAmount * 2;
    if (paymentPlan === "Every 3 Months") return rentAmount * 3;
    if (paymentPlan === "Every 6 Months") return rentAmount * 6;
    if (paymentPlan === "Every 12 Months") return rentAmount * 12;
  }, [leaseDetail]);

  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const handleApproveTermination = useCallback(() => {
    dispatch(approveLeaseTermination({ leaseId: leaseDetail?._id }));
    handleModalClose();
  }, [dispatch, leaseDetail?._id]);

  const handleAlertClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  if (isLoading) return <PageLoading />;

  if (!leaseDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Lease Does not Exists!</h1>
      </div>
    );

  return (
    <main className="mb-12 mt-4">
      <h3 className="my-4 font-heading font-bold text-center">
        Lease Detail
      </h3>
      <div className="flex flex-col w-11/12 mx-auto items-center gap-4 sm:flex-row sm:justify-center sm:items-start">
        <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
          <h4 className="font-bold">Real Estate</h4>
          <Link to={`/tenant/real-estate/${leaseDetail?.realEstate?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {leaseDetail?.realEstate?.title}
            </h5>
          </Link>
          <p>{leaseDetail?.realEstate?.category}</p>
          <p className="">
            <LocationOnOutlinedIcon color="success" />{" "}
            {leaseDetail?.realEstate?.address?.streetName},{" "}
            {leaseDetail?.realEstate?.address?.city},{" "}
            {leaseDetail?.realEstate?.address?.state},{" "}
            {leaseDetail?.realEstate?.address?.country}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
          <h4 className="font-bold">Property Owner</h4>
          <Link to={`/tenant/owner-user/${leaseDetail?.owner?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {leaseDetail?.owner?.firstName}{" "}
              {leaseDetail?.owner?.lastName}
            </h5>
          </Link>
          <div className="flex gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="">{leaseDetail?.owner?.phoneNumber}</p>
          </div>
          <div className="flex gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="lowercase overflow-clip">
              {leaseDetail?.owner?.email}
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
            {format(leaseDetail?.rentAmount)} per month
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
            {format(leaseDetail?.rentAmount)}
          </strong>{" "}
          per month. Total Rent amount of{" "}
          <strong>
            {countryToCurrency[currentCountry.code]}{" "}
            {format(calculateTotalRent())}
          </strong>{" "}
          shall be due and payable every{" "}
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
        <p className="font-robotoNormal">
          Signed By: <strong>{leaseDetail?.digitalSignature}</strong>
        </p>
        <p className="font-robotoNormal">
          Date: {dateFormatter(leaseDetail?.leaseSignTime)}
        </p>
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

      {leaseDetail?.status === "Terminated-pending" && (
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
                "Approve Termination of Lease"
            )}
          </Button>
        </div>
      )}

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Approve Lease Termination</h3>
          <p className="text-center my-4">
            Are you sure you want to approve the termination of this lease?
            This action will change the lease status to "Terminated-approve".
            This action cannot be undone.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="warning">
              Close
            </Button>

            <Button
              onClick={handleApproveTermination}
              color="error"
              variant="contained"
            >
              Terminate
            </Button>
          </div>
        </ConfirmModal>
      </div>
    </main>
  );
};

export default LeaseDetailPageTenant;
