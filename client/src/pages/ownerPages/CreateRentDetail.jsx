import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createRentDetail,
  clearAlert,
} from "../../features/rentDetailOwner/rentDetailOwnerSlice";
import { getOwnerAllContracts } from "../../features/ownerUser/ownerUserSlice";
import { AlertToast, ConfirmModal, PageLoading } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import createRentImage from "../../assets/images/createRentImage.svg";
import { calculateAddedDate } from "../../utils/valueFormatter";

const CreateRentDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, isProcessing, alertFlag, alertMsg, alertType } = useSelector(
    (state) => state.rentDetailOwner
  );

  const { allContracts, isLoading } = useSelector((state) => state.ownerUser);

  // get all real estate
  useEffect(() => {
    dispatch(getOwnerAllContracts());
  }, [dispatch]);

  const [contractForm, setContractFrom] = useState({
    tenant: "",
    realEstate: "",
    rentAmount: "",
    paymentPlan: "",
    startDate: "",
    tenantName: "",
  });

  // handle change in the form
  const handleChange = useCallback(
    (e) => {
      setContractFrom({ ...contractForm, [e.target.name]: e.target.value });
    },
    [contractForm]
  );

  // set rent amount to the price of the property when the property is selected
  useEffect(() => {
    if (contractForm.realEstate) {
      setContractFrom({
        ...contractForm,
        tenant: allContracts?.find(
          (contract) => contract.realEstate._id === contractForm.realEstate
        ).tenant._id,
        rentAmount: allContracts?.find(
          (contract) => contract.realEstate._id === contractForm.realEstate
        ).rentAmount,
        startDate: allContracts?.find(
          (contract) => contract.realEstate._id === contractForm.realEstate
        ).startDate,
        paymentPlan: allContracts?.find(
          (contract) => contract.realEstate._id === contractForm.realEstate
        ).paymentPlan,
        tenantName: allContracts
          ?.find(
            (contract) => contract.realEstate._id === contractForm.realEstate
          )
          .tenant.firstName.concat(
            " ",
            allContracts?.find(
              (contract) => contract.realEstate._id === contractForm.realEstate
            ).tenant.lastName
          ),
      });
    }
  }, [contractForm.realEstate, allContracts, setContractFrom, contractForm]);

  // Redirect to all rent details page
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/rentDetail`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

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

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();
    const { tenant, realEstate, paymentPlan, startDate } = contractForm;
    setFormData({
      tenant,
      realEstate,
      paymentPlan,
      startDate,
      currentRentDate: {
        from: startDate,
        to: calculateAddedDate(paymentPlan, startDate),
      },
    });

    handleModalOpen();
  };

  const handleCreateRentDetail = useCallback(() => {
    dispatch(createRentDetail({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  if (isLoading) return <PageLoading />;

  return (
    <main className="flex flex-col md:flex-row">
      <div className="mt-10 flex flex-col items-center md:ml-16 md:items-start">
        <div className="mb-6">
          <h3 className="font-heading font-bold">Create Rent Detail</h3>
          <p className="text-gray-400 -mt-2 font-robotoNormal">
            Fill in the form below to create the rent detail
          </p>
        </div>

        <div className="">
          <form id="form" onSubmit={handleConfirmation}>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="mb-4">
                <h5 className="text-gray-700 mb-3">
                  <HomeWorkRoundedIcon /> Select Your Real Estate
                </h5>
                <TextField
                  select
                  required
                  label="Real Estate"
                  value={contractForm.realEstate}
                  onChange={handleChange}
                  sx={{ width: "300px" }}
                  name="realEstate"
                  color="tertiary"
                >
                  {allContracts?.map((contract) => (
                    <MenuItem
                      key={contract._id}
                      value={contract.realEstate._id}
                      className=""
                    >
                      {contract.realEstate.title}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h5 className="text-gray-700 mb-3">
                  <InfoRoundedIcon /> Contract Details
                </h5>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <TextField
                    label="Tenant"
                    value={contractForm.tenantName}
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                  <TextField
                    label="Contract Start Date"
                    value={contractForm.startDate}
                    name="startDate"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                  <TextField
                    label="Payment Plan"
                    value={contractForm.paymentPlan}
                    name="paymentPlan"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />

                  <TextField
                    label="Rent Amount"
                    value={contractForm.rentAmount}
                    name="rentAmount"
                    color="tertiary"
                    sx={{ width: "300px" }}
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-4 mb-6">
              <Button
                disabled={isProcessing}
                type="submit"
                variant="contained"
                size="large"
                color="primary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
                startIcon={<BorderColorRoundedIcon />}
              >
                {isProcessing ? (
                  <CircularProgress
                    size={26}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <ConfirmModal open={open} handleModalClose={handleModalClose}>
            <h3 className="text-center">Create Rent Detail</h3>
            <p className="text-center my-4">
              Are you sure you want to create this rent detail? You won't be
              able to undo this action. The rent detail can only be deleted by
              the owner when the contract is terminated.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Close
              </Button>

              <Button
                onClick={handleCreateRentDetail}
                color="success"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </ConfirmModal>
        </div>
      </div>

      <div className="mt-10 mb-6 md:mb-0 mx-14 self-center">
        <img src={createRentImage} alt="" />
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

export default CreateRentDetail;
