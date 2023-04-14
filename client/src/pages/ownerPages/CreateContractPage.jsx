import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllContacts,
  createContract,
  clearAlert,
} from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, AlertToast, ConfirmModal } from "../../components";
import { Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import moment from "moment";
import contractImage from "../../assets/images/createContract.svg";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const CreateContractPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { realEstateId, title, price, slug } = location?.state; // state is passed from the previous page

  const { contacts, isProcessing, success, alertFlag, alertMsg, alertType } =
    useSelector((state) => state.ownerUser);

  useEffect(() => {
    dispatch(getAllContacts({ name: "" }));
  }, [dispatch]);

  const [contractForm, setContractFrom] = useState({
    tenant: "",
    realEstate: realEstateId,
    rentAmount: price,
    paymentPlan: "",
  });

  const [date, setDate] = useState(null);

  const handleChange = useCallback(
    (e) => {
      setContractFrom({ ...contractForm, [e.target.name]: e.target.value });
    },
    [contractForm]
  );

  const paymentPlans = [
    "Monthly",
    "Every 2 Months",
    "Every 3 Months",
    "Every 6 Months",
    "Every 12 Months",
  ];

  // Redirect to detail page of the property after successful contract creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${slug}`);
      }, 3000);
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

  //modal
  const [open, setOpen] = useState(false);
  const handleModalOpen = useCallback(() => setOpen(true), []);
  const handleModalClose = useCallback(() => setOpen(false), []);

  const [formData, setFormData] = useState({});
  const handleConfirmation = (e) => {
    e.preventDefault();
    const { tenant, realEstate, rentAmount, paymentPlan } = contractForm;
    setFormData({
      tenant,
      realEstate,
      rentAmount,
      paymentPlan,
      startDate: moment(date).format("YYYY-MM").concat("-01"),
    });

    handleModalOpen();
  };

  const handleCreateContract = useCallback(() => {
    dispatch(createContract({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  return (
    <main className="flex flex-row mb-8 md:mb-0">
      <div className="mt-10 flex flex-col items-center md:ml-14 md:items-start">
        <div className="mb-6">
          <h3 className="font-heading font-bold">Create Contract</h3>
          <p className="text-gray-400 -mt-2 font-robotoNormal">
            Fill in the form below to create a contract
          </p>
        </div>
        <div className="mb-4 flex items-center">
          <h5 className="font-semibold">Real Estate Title: </h5>
          <h5 className="ml-2">{title}</h5>
        </div>
        <div className="">
          <form id="form" onSubmit={handleConfirmation}>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <TextField
                select
                required
                label="Tenant User"
                value={contractForm.tenant}
                onChange={handleChange}
                sx={{ width: "300px" }}
                name="tenant"
                color="tertiary"
              >
                {contacts?.map((user) => (
                  <MenuItem key={user._id} value={user._id} className="">
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </TextField>
              <DatePicker
                label="Contract Start Date"
                value={date}
                views={["year", "month"]}
                handleChange={useCallback(
                  (date) => {
                    setDate(date);
                  },
                  [setDate]
                )}
              />

              <TextField
                select
                required
                label="Payment Plan"
                value={contractForm.paymentPlan}
                onChange={handleChange}
                sx={{ width: "300px" }}
                name="paymentPlan"
                color="tertiary"
              >
                {paymentPlans.map((option, index) => (
                  <MenuItem key={index} value={option} className="">
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Rent Amount"
                value={contractForm.rentAmount}
                name="rentAmount"
                color="tertiary"
                sx={{ width: "300px" }}
                disabled
              />
            </div>
            <div className="text-center mt-4 mb-6">
              <Button
                disabled={
                  isProcessing || (alertFlag && alertType === "success")
                }
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
            <h3 className="text-center">Confirm Contract?</h3>
            <p className="text-center my-4">
              Are you sure you want to create this contract? Once the contract
              is created, you will not be able to edit it. You can only delete
              it. The tenant will be notified of the contract creation.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Close
              </Button>

              <Button
                onClick={handleCreateContract}
                color="success"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </ConfirmModal>
        </div>
      </div>

      <div className="hidden md:block mx-auto mt-10 mb-6 md:mb-0">
        <img src={contractImage} alt="" />
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

export default CreateContractPage;
