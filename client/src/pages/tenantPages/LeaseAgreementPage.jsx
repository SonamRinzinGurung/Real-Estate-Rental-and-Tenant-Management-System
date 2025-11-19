import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getLeaseWithRealEstateID,
  clearAlert,
  signLease,
} from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, ConfirmModal } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import {
  createNumberFormatter,
  dateFormatter,
} from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";
import leaseApprovedImg from "../../assets/images/leaseApproved.svg";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import useToast from "../../hooks/useToast";
import { toast } from "react-toastify";
import ImageViewer from "react-simple-image-viewer";

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

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);
  const [checked, setChecked] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState("");

  // Collapse Rental Agreement content
  const [isAgreementCollapsed, setIsAgreementCollapsed] = useState(false);
  const toggleAgreementCollapse = useCallback(() => {
    setIsAgreementCollapsed((prev) => !prev);
  }, []);

  // Image Viewer state and handlers for proof of income
  const [isViewerOpen, setIsViewerOpen] = useState({
    proofOfIncome: false,
    photoId: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageViewer = useCallback((type, index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen((prev) => ({ ...prev, [type]: true }));
  }, []);

  const closeImageViewer = useCallback(() => {
    setCurrentImageIndex(0);
    setIsViewerOpen({
      proofOfIncome: false,
      photoId: false,
    });
  }, []);

  const handleCheckboxChange = (e) => {
    if (isAgreementCollapsed && e.target.checked) {
      toast.info("Please expand and read the full agreement before agreeing.");
      e.target.checked = false;
      return;
    }
    setChecked(e.target.checked);
  };

  const handleApproveLease = useCallback(() => {
    if (!checked) {
      toast.info("You must agree to the terms and conditions to proceed.");
      return;
    } else if (digitalSignature.trim() === "") {
      toast.info("Please provide your digital signature to proceed.");
      return;
    }
    const leaseSignTime = new Date().toISOString();
    dispatch(
      signLease({ leaseId: leaseDetail._id, digitalSignature, leaseSignTime })
    );
    handleModalClose();
  }, [dispatch, leaseDetail, handleModalClose, checked, digitalSignature]);

  if (isLoading) return <PageLoading />;

  if (!leaseDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Lease Does not Exists!</h1>
      </div>
    );

  if (leaseDetail?.status !== "Unsigned") {
    return (
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
          <img src={leaseApprovedImg} className="w-full" alt="login banner" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 items-center lg:items-start lg:ml-10 mt-8 mx-2 md:mx-0">
      {/* Lease Agreement Page Header */}
      <div className="flex gap-4 items-center">
        <h3 className="font-heading font-bold">Lease Agreement Page</h3>
        <div className="flex justify-center items-center gap-2">
          <PendingActionsIcon color="info" />
          <p className="font-bold">Unsigned Lease</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Property Details */}
        <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
          <h5 className="font-semibold">Property Details</h5>
          <Link to={`/tenant/real-estate/${leaseDetail?.realEstate?.slug}`}>
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
        {/* Owner Details*/}
        <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
          <h5 className="font-semibold">Property Owner</h5>
          <Link to={`/tenant/owner-user/${leaseDetail?.owner?.slug}`}>
            <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
              {leaseDetail?.owner?.firstName} {leaseDetail?.owner?.lastName}
            </h5>
          </Link>
          <div className="flex gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="lowercase overflow-clip">
              {leaseDetail?.owner?.email}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
            <p className="">{leaseDetail?.owner?.phoneNumber}</p>
          </div>
        </div>

        {/* Tenant Information */}
        <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
          <div className="flex justify-start items-center gap-2">
            <h5 className="font-semibold">Lease Tenant Information</h5>
          </div>
          <h5 className="font-robotoNormal">
            {leaseDetail?.tenantInformation?.fullName}
          </h5>
          <div className="flex gap-2 items-center">
            <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
            <p className="">{leaseDetail?.tenantInformation?.email}</p>
          </div>
          <div className="flex gap-2 items-center">
            <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />

            <p className="">{leaseDetail?.tenantInformation?.phoneNumber}</p>
          </div>
          <div className="flex gap-2 md:gap-4">
            <Button
              onClick={() => openImageViewer("photoId", 0)}
              variant="outlined"
              size="small"
              color="info"
            >
              Photo ID
            </Button>
            <Button
              onClick={() =>
                openImageViewer("proofOfIncome", currentImageIndex)
              }
              variant="outlined"
              size="small"
              color="info"
            >
              Proof of Income
            </Button>
          </div>

          {isViewerOpen.photoId && (
            <ImageViewer
              src={[leaseDetail?.tenantInformation?.photoId]}
              currentIndex={currentImageIndex}
              onClose={closeImageViewer}
              disableScroll={false}
              backgroundStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
              closeOnClickOutside={true}
            />
          )}
          {isViewerOpen.proofOfIncome && (
            <ImageViewer
              src={leaseDetail?.tenantInformation?.proofOfIncome}
              currentIndex={currentImageIndex}
              onClose={closeImageViewer}
              disableScroll={false}
              backgroundStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
              closeOnClickOutside={true}
            />
          )}
        </div>

        {/* Lease Details */}
        <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
          <h5 className="font-semibold">Lease Details</h5>
          <div>
            <p className="">
              <span className="font-robotoNormal">Lease Start Date</span>:{" "}
              {dateFormatter(leaseDetail?.startDate)}
            </p>
          </div>

          {leaseDetail?.endDate && (
            <div>
              <p className="">
                <span className="font-robotoNormal">Lease End Date</span>:{" "}
                {dateFormatter(leaseDetail?.endDate)}
              </p>
            </div>
          )}
          <div>
            <p className="">
              <span className="font-robotoNormal">Payment Plan</span>:{" "}
              {leaseDetail?.paymentPlan}
            </p>
          </div>
          <div>
            <p className="">
              <span className="font-robotoNormal">Rent Amount</span>:{" "}
              {countryToCurrency[currentCountry.code]}{" "}
              {format(leaseDetail?.realEstate?.price)} per month
            </p>
          </div>
        </div>
      </div>

      {/* Rental Agreement Terms of Lease */}
      <div
        className={`flex flex-col gap-2 p-4 ${!isAgreementCollapsed && "shadow-md rounded-md border border-gray-200"
          }`}
      >
        <div className="flex justify-start items-center gap-2">
          <h5 className="font-semibold">Rental Agreement of Lease</h5>
          <div>
            <Button
              onClick={toggleAgreementCollapse}
              variant="text"
              size="small"
            >
              {isAgreementCollapsed ? "Show Full Agreement" : "Hide Agreement"}
            </Button>
          </div>
        </div>

        {!isAgreementCollapsed && (
          <div className="flex flex-col gap-2 p-2">
            <p>
              This Rental Agreement of Lease is applicable from{" "}
              <strong>{dateFormatter(leaseDetail?.startDate)}</strong>, created
              by the property owner{" "}
              <strong>
                {leaseDetail?.owner?.firstName} {leaseDetail?.owner?.lastName}
              </strong>
              , for the rental of the property located at{" "}
              <strong>
                {leaseDetail?.realEstate?.address?.streetName},{" "}
                {leaseDetail?.realEstate?.address?.city},{" "}
                {leaseDetail?.realEstate?.address?.state},{" "}
                {leaseDetail?.realEstate?.address?.country}
              </strong>{" "}
              with the tenant{" "}
              <strong>
                {leaseDetail?.tenant?.firstName} {leaseDetail?.tenant?.lastName}
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
              <strong>{leaseDetail?.paymentPlan}</strong> on the first day of
              the calendar month and shall be considered late if not received by
              the Landlord on or before the 7th day of the month.
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
        )}
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="agree" onChange={handleCheckboxChange} />
          <label htmlFor="agree" className="">
            By checking this box, I agree to the terms and conditions of this
            lease.
          </label>
        </div>

        {/* digital signature */}
        <div className="flex flex-col gap-1">
          <p className="font-robotoNormal font-semibold">
            Please type your full name as a digital signature
          </p>
          <input
            type="text"
            value={digitalSignature}
            onChange={(e) => setDigitalSignature(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* {disclaimer} */}
        <div className="mt-6">
          <p className="text-sm">
            <strong>Disclaimer:</strong> This lease is a legally binding
            document. By signing your name on this lease, you agree to all the
            terms and conditions outlined herein.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full px-4 py-4 md:px-48 md:py-6 lg:-ml-6 shadow-md rounded-md border border-gray-200 items-center my-6">
        <h4 className="font-semibold">Lease Action</h4>
        <p>
          If you do not agree to the terms and conditions of this lease, you may
          choose to not accept it. By clicking the "Sign Lease" button and
          confirming, you will be agreeing to the terms and conditions of this
          lease.
        </p>

        <div className="flex justify-start mt-6">
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
              "Sign Lease"
            )}
          </Button>
        </div>
      </div>

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Agree to Lease?</h3>
          <p className="text-center my-4">
            Are you sure you want to agree to the terms on this lease? Once you
            sign this lease, you will not be able to terminate it without the
            consent of the property owner. You will be agreeing to the terms and
            conditions of this lease.
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
    </main>
  );
};

export default LeaseAgreementPage;
