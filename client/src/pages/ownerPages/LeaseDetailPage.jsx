import { useState, useEffect, useCallback } from "react";
import {
  getLeaseOwnerView,
  clearAlert,
  deleteLease,
  terminateLease,
  updateLeaseToUnsigned,
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
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ChecklistIcon from "@mui/icons-material/Checklist";
import {
  createNumberFormatter,
  dateFormatter,
} from "../../utils/valueFormatter";
import { countries } from "../../utils/countryList";
import countryToCurrency from "country-to-currency";
import useToast from "../../hooks/useToast";
import ImageViewer from "react-simple-image-viewer";

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

  // Collapse Rental Agreement content
  const [isAgreementCollapsed, setIsAgreementCollapsed] = useState(true);
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

  const currentCountry = countries.find(
    (country) => country.label === leaseDetail?.realEstate?.address?.country
  );
  const format = createNumberFormatter(currentCountry?.code);

  const handleUpdateLeaseToUnsigned = useCallback(() => {
    dispatch(updateLeaseToUnsigned({ leaseId: leaseDetail?._id }));
    handleModalClose();
  }, [dispatch, leaseDetail?._id, handleModalClose]);

  const handleTerminateLease = useCallback(() => {
    dispatch(terminateLease({ leaseId: leaseDetail?._id }));
    handleModalClose();
  }, [dispatch, leaseDetail?._id, handleModalClose]);

  const handleDeleteLease = useCallback(() => {
    dispatch(deleteLease({ leaseId: leaseDetail?._id }));
    handleModalClose();
  }, [dispatch, leaseDetail?._id, handleModalClose]);

  const statusFlags = (status) => {
    return {
      isPending: status === "Pending",
      isPendingUpdated: status === "Pending-updated",
      isActive: status === "Active",
      isTerminatedPending: status === "Terminated-pending",
      isTerminatedApproved: status === "Terminated-approved",
      isUnsigned: status === "Unsigned",
    };
  };

  const flags = statusFlags(leaseDetail?.status);

  if (isLoading) return <PageLoading />;

  if (!leaseDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Lease Does not Exists!</h1>
      </div>
    );

  return (
    <main className="flex flex-col gap-6 items-center lg:items-start lg:ml-10 mt-8 mx-2 md:mx-0">
      <div className="flex gap-4 items-center">
        <h3 className="font-heading font-bold">Lease Detail</h3>
        <div className="flex justify-center items-center gap-2">
          {flags.isActive && (
            <>
              <CheckCircleRoundedIcon color="success" />
              <p className="font-bold">Active Lease</p>
            </>
          )}
          {flags.isPending && (
            <>
              <HourglassBottomIcon color="info" />
              <p className="font-bold">Pending Information</p>
            </>
          )}
          {flags.isPendingUpdated && (
            <>
              <HourglassBottomIcon color="info" />
              <p className="font-bold">Pending Approval</p>
            </>
          )}
          {flags.isUnsigned && (
            <>
              <PendingActionsIcon color="info" />
              <p className="font-bold">Unsigned Lease</p>
            </>
          )}
          {flags.isTerminatedPending && (
            <>
              <RemoveCircleRoundedIcon color="error" />
              <p className="font-bold">Terminated (Pending Approval)</p>
            </>
          )}
          {flags.isTerminatedApproved && (
            <>
              <RemoveCircleRoundedIcon color="error" />
              <p className="font-bold">Terminated (Approved)</p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Property Details */}
        <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
          <h5 className="font-semibold">Property Details</h5>
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

        {flags.isPending && (
          <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
            <h5 className="font-semibold">Tenant User</h5>
            <Link to={`/owner/tenant-user/${leaseDetail?.tenant?.slug}`}>
              <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                {leaseDetail?.tenant?.firstName} {leaseDetail?.tenant?.lastName}
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
        )}

        {/* Tenant Information */}
        {!flags.isPending && (
          <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200 max-w-sm">
            <div className="flex justify-start items-center gap-2">
              <h5 className="font-semibold">Lease Tenant Information</h5>
            </div>
            <Link to={`/owner/tenant-user/${leaseDetail?.tenant?.slug}`}>
              <h5 className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer">
                {leaseDetail?.tenantInformation?.fullName}
              </h5>
            </Link>
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
        )}
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

        {/* Tenant Emergency Contact */}
        {!flags.isPending && (
          <div className="flex flex-col gap-2 p-4 shadow-md rounded-md border border-gray-200">
            <h5 className="font-semibold">Tenant Emergency Contact</h5>
            <div>
              <p>
                Name:{" "}
                <span className="font-robotoNormal">
                  {leaseDetail?.tenantInformation?.emergencyContact?.name}
                </span>
              </p>
              <p>
                Relationship:{" "}
                <span className="font-robotoNormal">
                  {
                    leaseDetail?.tenantInformation?.emergencyContact
                      ?.relationship
                  }
                </span>
              </p>
              <p>
                Phone Number:{" "}
                <span className="font-robotoNormal">
                  {
                    leaseDetail?.tenantInformation?.emergencyContact
                      ?.phoneNumber
                  }
                </span>
              </p>
            </div>
          </div>
        )}
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

      {leaseDetail?.digitalSignature && (
        <div className="flex flex-col gap-4 p-4 self-start">
          <h4>Digital Signature</h4>
          <div className="flex flex-col gap-1">
            <div className="flex-1">
              <p className="font-roboto">
                <span className="block text-sm text-gray-600">Signed By</span>
                <span className="font-serif font-semibold block">
                  {leaseDetail?.digitalSignature ?? "-"}
                </span>
              </p>
            </div>
            <div className="flex-1">
              <p className="font-roboto">
                <span className="block text-sm text-gray-600">Date</span>
                <span className="font-serif font-semibold block">
                  {dateFormatter(leaseDetail?.leaseSignTime) ?? "-"}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lease Actions */}
      {!flags.isTerminatedPending && (
        <div className="flex flex-col gap-4 w-full px-4 py-4 md:px-48 md:py-6 lg:-ml-6 shadow-md rounded-md border border-gray-200 items-center my-6">
          <h4 className="font-semibold">Lease Action</h4>
          <p>
            {flags.isActive &&
              'Terminate this lease. This action will change the lease status to "Terminated-pending". Tenant user will need to approve the termination.'}

            {!flags.isActive &&
              !flags.isPendingUpdated &&
              "You may delete this lease. This action is irreversible. This will also delete the associated Rent Details and Payment Records (if they exist)."}

            {flags.isPendingUpdated &&
              "You may approve this lease. Only approve if all the tenant information provided is valid and all the necessary payments have been received."}
          </p>

          <div className="flex justify-start mt-6">
            <Button
              onClick={handleModalOpen}
              variant="contained"
              size="medium"
              color={flags.isPendingUpdated ? "success" : "error"}
              sx={{ color: "#fff" }}
              disabled={isProcessing || (alertFlag && alertType === "success")}
              startIcon={
                flags.isPendingUpdated ? (
                  <ChecklistIcon />
                ) : (
                  <RemoveCircleRoundedIcon />
                )
              }
            >
              {isProcessing ? (
                <CircularProgress
                  size={26}
                  sx={{
                    color: "#fff",
                  }}
                />
              ) : (
                <>
                  {flags.isActive && "Terminate Lease"}
                  {!flags.isActive && !flags.isPendingUpdated && "Delete Lease"}
                  {flags.isPendingUpdated && "Approve Lease"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal open={open} handleModalClose={handleModalClose}>
        <h3 className="text-center">
          {flags.isActive && "Terminate Lease"}
          {!flags.isActive && !flags.isPendingUpdated && "Delete Lease"}
          {flags.isPendingUpdated && "Approve Lease"}
        </h3>
        <p className="text-center my-4">
          {flags.isActive &&
            'Are you sure you want to terminate this lease? This action will change the lease status to "Terminated-pending".'}

          {!flags.isActive &&
            !flags.isPendingUpdated &&
            "Are you sure you want to delete this lease? This action is irreversible. This will also delete the associated Rent Details and Payment Records (if they exist)."}

          {flags.isPendingUpdated &&
            "Are you sure you want to approve this lease? Only approve if all the tenant information provided is valid and all the necessary payments have been received."}
        </p>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <Button onClick={handleModalClose} color="warning">
            Close
          </Button>

          <Button
            onClick={
              flags.isActive
                ? handleTerminateLease
                : !flags.isActive && !flags.isPendingUpdated
                  ? handleDeleteLease
                  : flags.isPendingUpdated
                    ? handleUpdateLeaseToUnsigned
                    : null
            }
            color={flags.isPendingUpdated ? "success" : "error"}
            variant="contained"
          >
            {flags.isActive
              ? "Terminate"
              : !flags.isActive && !flags.isPendingUpdated
                ? "Delete"
                : flags.isPendingUpdated
                  ? "Approve"
                  : ""}
          </Button>
        </div>
      </ConfirmModal>
    </main>
  );
};

export default LeaseDetailPage;
