import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getLeaseWithRealEstateID,
  clearAlert,
  approveLease,
} from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, AlertToast, ConfirmModal } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { createNumberFormatter, dateFormatter, format } from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";
import leaseApprovedImg from "../../assets/images/leaseApproved.svg";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";

const LeaseAgreementPage = () => {
  const { realEstateId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const currentCountry = countries.find(
    (country) => country.label === leaseDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

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
  const [checked, setChecked] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState("");

  const handleApproveLease = useCallback(() => {
    if (!checked) {
      alert("You must agree to the terms and conditions to proceed.");
      return;
    } else if (digitalSignature.trim() === "") {
      alert("Please provide your digital signature to proceed.");
      return;
    }
    const leaseSignTime = new Date().toISOString();
    dispatch(approveLease({ leaseId: leaseDetail._id, digitalSignature, leaseSignTime }));
    handleModalClose();
  }, [dispatch, leaseDetail, handleModalClose, checked, digitalSignature]);

  // calculate the total rent amount according to payment plan
  const calculateTotalRent = useCallback(() => {
    const { paymentPlan, rentAmount } = leaseDetail;
    if (paymentPlan === "Monthly") return rentAmount;
    if (paymentPlan === "Every 2 Months") return rentAmount * 2;
    if (paymentPlan === "Every 3 Months") return rentAmount * 3;
    if (paymentPlan === "Every 6 Months") return rentAmount * 6;
    if (paymentPlan === "Every 12 Months") return rentAmount * 12;
  }, [leaseDetail]);

  if (isLoading) return <PageLoading />;

  if (!leaseDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Lease Does not Exists!</h1>
      </div>
    );

  return (
    <main className="mb-12">
      {leaseDetail?.status === "Pending" && (
        <>
          <h3 className="my-4 font-heading font-bold text-center">
            Lease Agreement Page
          </h3>
          <div className="flex flex-col w-11/12 mx-auto items-center gap-4 sm:flex-row sm:justify-center sm:items-start">
            <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
              <h4 className="font-bold">Real Estate</h4>
              <Link
                to={`/tenant/real-estate/${leaseDetail?.realEstate?.slug}`}
              >
                <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                  {leaseDetail?.realEstate?.title}
                </h5>
              </Link>
              <p>{leaseDetail?.realEstate?.category}</p>
              <p className="">
                <LocationOnOutlinedIcon color="success" />{" "}
                {leaseDetail?.realEstate?.address.streetName},{" "}
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
                <span className="font-medium">Rent Amount</span>: {countryToCurrency[currentCountry.code]}{" "}
                {format(leaseDetail?.rentAmount)} per month
              </h5>
            </div>
          </div>
          <div className="w-11/12 mx-auto text-justify mt-6">
            <h4>Rental Agreement Lease</h4>
            <p>
              This Rental Agreement Lease is applicable from{" "}
              <strong>{dateFormatter(leaseDetail?.startDate)}</strong>,
              created by the property owner{" "}
              <strong>
                {leaseDetail?.owner?.firstName}{" "}
                {leaseDetail?.owner?.lastName}
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
              <strong>{countryToCurrency[currentCountry.code]} {format(leaseDetail?.rentAmount)}</strong> per
              month. Total Rent amount of{" "}
              <strong>{countryToCurrency[currentCountry.code]} {format(calculateTotalRent())}</strong> shall be due
              and payable <strong>{leaseDetail?.paymentPlan}</strong> on the
              first day of the calendar month and shall be considered late if
              not received by the Landlord on or before the 7th day of the
              month.
            </p>
            <br />
            <h5>2. Late Fees</h5>
            <p>
              If rent is not received by the 7th day of the month, a late fee of
              5% shall be added to the total amount due.
            </p>
            <br />
            <h5>3. Termination of Agreement</h5>
            <p>
              The Landlord may terminate this Agreement if rent is more than 30
              days late. In such event, Tenant shall vacate the Property
              immediately.
            </p>
            <br />
            <h5>4. Entire Agreement</h5>
            <p>
              This Agreement constitutes the entire agreement between the
              parties and supersedes all prior negotiations, understandings, and
              agreements between the parties, whether written or oral.
            </p>
            <br />
            <h5>5. Amendments</h5>
            <p>
              This Agreement may only be amended by written instrument executed
              by both parties.
            </p>
            <br />
            <h5>6. Governing Law</h5>
            <p>
              This Agreement shall be governed by and construed in accordance
              with the laws of the state in which the Property is located.
            </p>
            <br />
            <h5>7. Assignment and Binding Effect</h5>
            <p>
              Tenant shall not assign this Agreement or sublease the Property
              without the prior written consent of the Landlord. This Agreement
              shall be binding upon and inure to the benefit of both parties,
              their heirs, legal representatives, successors, and assigns.
            </p>
            <br />
          </div>

          <div className="flex items-center mt-4 w-11/12 mx-auto">
            <input
              type="checkbox"
              id="agree"
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
            <label htmlFor="agree" className="ml-2">
              By checking this box, I agree to the terms and conditions of
              this lease.
            </label>
          </div>

          {/* digital signature */}
          <div className="mt-4 w-11/12 mx-auto">
            <h5 className="font-robotoNormal">
              Please type your full name as a digital signature:{" "}
              <input
                type="text"
                value={digitalSignature}
                onChange={(e) => setDigitalSignature(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              />
            </h5>
          </div>

          {/* {disclaimer} */}
          <div className="w-11/12 mx-auto text-justify mt-6">
            <p className="text-sm">
              <strong>Disclaimer:</strong> This lease is a legally binding
              document. By signing your name on this lease, you agree to all the terms
              and conditions outlined herein.
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleModalOpen}
              variant="contained"
              size="large"
              color="tertiary"
              sx={{ color: "#fff" }}
              disabled={isProcessing}
              startIcon={<CheckCircleRoundedIcon />}
            >
              {isProcessing ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                  "Accept Lease"
              )}
            </Button>
          </div>
        </>
      )}

      {leaseDetail?.status === "Active" && (
        <div className="flex flex-col items-center mt-10 gap-2">
          <h1 className="text-center">Lease is active</h1>
          <Button
            onClick={() => navigate("/tenant")}
            variant="text"
            color="primary"
            size="large"
          >
            Go Home
          </Button>
          <div className="w-56">
            <img
              src={leaseApprovedImg}
              className="w-full"
              alt="login banner"
            />
          </div>
        </div>
      )}

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Agree to Lease?</h3>
          <p className="text-center my-4">
            Are you sure you want to agree to this lease? Once you agree to
            this lease, you will not be able to cancel it. You will be
            agreeing to the terms and conditions of this lease.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="error">
              Close
            </Button>

            <Button
              onClick={handleApproveLease}
              color="success"
              variant="contained"
            >
              Confirm
            </Button>
          </div>
        </ConfirmModal>
      </div>

      <AlertToast
        alertFlag={alertFlag}
        alertMsg={alertMsg}
        alertType={alertType}
        handleClose={handleAlertClose}
      />
    </main>
  );
};

export default LeaseAgreementPage;
