import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getContractWithID,
  clearAlert,
} from "../../features/tenantUser/tenantUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { PageLoading, AlertToast } from "../../components";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import { dateFormatter, format } from "../../utils/valueFormatter";
import { Button, CircularProgress } from "@mui/material";

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

  if (isLoading) return <PageLoading />;

  if (!contractDetail)
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Contract Does not Exists!</h1>
      </div>
    );

  if (contractDetail?.status === "Active")
    return (
      <div className="flex justify-center items-start h-screen mt-10">
        <h1>Contract is active</h1>
      </div>
    );

  return (
    <main>
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
            {contractDetail?.owner?.firstName} {contractDetail?.owner?.lastName}
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
          variant="contained"
          size="large"
          color="success"
          sx={{ color: "#fff" }}
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
