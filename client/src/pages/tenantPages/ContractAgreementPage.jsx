import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getContractWithID,
  clearAlert,
  approveContract,
} from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, AlertToast, ConfirmModal } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { dateFormatter, format } from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";
import contractApprovedImg from "../../assets/images/contractApproved.svg";

const ContractAgreementPage = () => {
  const { contractId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getContractWithID({ contractId }));
  }, [dispatch, contractId]);

  const {
    contractDetail,
    isLoading,
    isProcessing,
    alertFlag,
    alertType,
    alertMsg,
  } = useSelector((state) => state.tenantUser);

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

  const handleApproveContract = useCallback(() => {
    dispatch(approveContract({ contractId }));
    handleModalClose();
  }, [dispatch, contractId, handleModalClose]);

  if (isLoading) return <PageLoading />;

  if (!contractDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Contract Does not Exists!</h1>
      </div>
    );

  return (
    <main className="mb-12">
      {contractDetail?.status === "Pending" && (
        <>
          <h3 className="my-4 font-heading font-bold text-center">
            Contract Agreement Page
          </h3>
          <div className="flex flex-col w-11/12 mx-auto items-center gap-4 sm:flex-row sm:justify-center sm:items-start">
            <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
              <h4 className="font-bold">Real Estate</h4>
              <h5
                className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer"
                onClick={() =>
                  navigate(
                    `/tenant/real-estate/${contractDetail?.realEstate?.slug}`
                  )
                }
              >
                {contractDetail?.realEstate?.title}
              </h5>
              <p>{contractDetail?.realEstate?.category}</p>
              <p className="">
                <LocationOnOutlinedIcon color="success" />{" "}
                {contractDetail?.realEstate?.address.location},{" "}
                {contractDetail?.realEstate?.address?.streetName}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-3/5  p-4 items-center text-center">
              <h4 className="font-bold">Property Owner</h4>
              <h5
                className="font-robotoNormal hover:text-primaryDark duration-300 ease-in-out cursor-pointer"
                onClick={() =>
                  navigate(`/tenant/owner-user/${contractDetail?.owner?.slug}`)
                }
              >
                {contractDetail?.owner?.firstName}{" "}
                {contractDetail?.owner?.lastName}
              </h5>
              <div className="flex gap-2 items-center">
                <LocalPhoneRoundedIcon sx={{ color: "#6D9886" }} />
                <p className="">{contractDetail?.owner?.phoneNumber}</p>
              </div>
              <div className="flex gap-2 items-center">
                <EmailRoundedIcon sx={{ color: "#E7AB79" }} />
                <p className="lowercase overflow-clip">
                  {contractDetail?.owner?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center mt-4 text-center">
            <h4 className="font-bold">Contract Details</h4>
            <div>
              <h5 className="font-robotoNormal">
                <span className="font-medium">Contract Start Date</span>:{" "}
                {dateFormatter(contractDetail?.startDate)}
              </h5>
            </div>
            <div>
              <h5 className="font-robotoNormal">
                <span className="font-medium">Payment Plan</span>:{" "}
                {contractDetail?.paymentPlan}
              </h5>
            </div>
            <div>
              <h5 className="font-robotoNormal">
                <span className="font-medium">Rent Amount</span>: NRS.{" "}
                {format(contractDetail?.rentAmount)} per month
              </h5>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleModalOpen}
              variant="contained"
              size="large"
              color="tertiary"
              sx={{ color: "#fff" }}
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
                "Accept"
              )}
            </Button>
          </div>
        </>
      )}

      {contractDetail?.status === "Active" && (
        <div className="flex flex-col items-center mt-10 gap-2">
          <h1 className="text-center">Contract is active</h1>
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
              src={contractApprovedImg}
              className="w-full"
              alt="login banner"
            />
          </div>
        </div>
      )}

      <div>
        <ConfirmModal open={open} handleModalClose={handleModalClose}>
          <h3 className="text-center">Agree to Contract</h3>
          <p className="text-center my-4">
            Are you sure you want to approve this contract?
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <Button onClick={handleModalClose} color="error">
              Close
            </Button>

            <Button
              onClick={handleApproveContract}
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

export default ContractAgreementPage;
