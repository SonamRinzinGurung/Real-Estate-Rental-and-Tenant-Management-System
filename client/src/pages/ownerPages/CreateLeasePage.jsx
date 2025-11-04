import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAllContacts,
  createLease,
  clearAlert,
  getTenantUserDetails
} from "../../features/ownerUser/ownerUserSlice";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, AlertToast, ConfirmModal, RealEstateCard } from "../../components";
import { Button, CircularProgress, TextField, MenuItem, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import moment from "moment";
import leaseImage from "../../assets/images/createLease.svg";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import SearchIcon from '@mui/icons-material/Search';
import {
  getRealEstateDetail,
} from "../../features/realEstateOwner/realEstateOwnerSlice";
import { calculateTotalRent } from "../../utils/valueFormatter";

const CreateLeasePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const { slug } = param;

  const { contacts, isProcessing, success, alertFlag, alertMsg, alertType } =
    useSelector((state) => state.ownerUser);

  const {
    realEstate
  } = useSelector((store) => store.realEstateOwner);

  useEffect(() => {
    dispatch(getRealEstateDetail({ slug }));
  }, [slug, dispatch]);


  const [leaseForm, setLeaseFrom] = useState({
    tenant: null,
    realEstate: "",
    rentAmount: "",
    paymentPlan: "",
  });

  const [formData, setFormData] = useState({});

  // keep leaseForm in sync when realEstate is loaded/updated
  useEffect(() => {
    if (!realEstate) return;
    setLeaseFrom((prev) => ({
      ...prev,
      realEstate: realEstate._id ?? prev.realEstate,
      rentAmount: realEstate.price ?? prev.rentAmount,
    }));
  }, [realEstate]);

  const [date, setDate] = useState(null);
  const [email, setEmail] = useState("");

  const handleFindTenant = useCallback(() => {
    dispatch(getTenantUserDetails({ email })).then((res) => {
      if (res.payload) {
        setLeaseFrom({ ...leaseForm, tenant: res.payload.user });
      }
    });
  }, [contacts, email, leaseForm]);

  const handleChange = useCallback(
    (e) => {
      setLeaseFrom({ ...leaseForm, [e.target.name]: e.target.value });
    },
    [leaseForm]
  );

  const paymentPlans = [
    "Monthly",
    "Every 2 Months",
    "Every 3 Months",
    "Every 6 Months",
    "Every 12 Months",
  ];

  // Redirect to detail page of the property after successful lease creation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/owner/real-estate/${slug}`);
      }, 1500);
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

  const handleConfirmation = (e) => {
    e.preventDefault();
    const { tenant, realEstate, rentAmount, paymentPlan } = leaseForm;
    setFormData({
      tenant: tenant._id,
      realEstate,
      rentAmount,
      paymentPlan,
      startDate: moment(date).format("YYYY-MM").concat("-01"),
    });

    handleModalOpen();
  };

  const handleCreateLease = useCallback(() => {
    dispatch(createLease({ formData }));
    handleModalClose();
  }, [dispatch, formData, handleModalClose]);

  return (
    <main className="flex flex-row">
      <div className="mt-10 flex flex-col items-center justify-center mx-auto md:items-start gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <h3 className="font-heading font-bold">Create Lease</h3>
          <p className="text-gray-400 -mt-2 font-robotoNormal">
            Fill in the form below to create a lease
          </p>
        </div>
        {realEstate && <RealEstateCard key={realEstate._id} {...realEstate} fromOwnerUser />}
        <div className="">
          <form id="form" onSubmit={handleConfirmation}>
            <div className="flex flex-col gap-4 justify-center md:justify-start">
              <OutlinedInput
                id="find-tenant"
                type='text'
                placeholder="Enter Tenant Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ width: "300px" }}
                color="tertiary"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleFindTenant}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />

              {leaseForm.tenant && (
                <div>
                  <div className="flex  items-center gap-2">
                    <p className="font-robotoNormal font-semibold">
                      Selected Tenant:
                    </p>
                    <div>
                      <img className="w-10 h-10 object-cover rounded-full" src={leaseForm?.tenant?.profileImage} alt="" />
                    </div>
                    <div>
                      {leaseForm?.tenant.firstName} {leaseForm?.tenant.lastName}
                    </div>
                  </div>
                </div>
              )}

              <DatePicker
                label="Lease Start Date"
                value={date}
                views={["year", "month"]}
                handleChange={useCallback(
                  (date) => {
                    setDate(date);
                  },
                  [setDate]
                )}
              />
              <DatePicker
                label="Lease End Date"
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
                value={leaseForm.paymentPlan}
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
                value={calculateTotalRent(leaseForm.paymentPlan, leaseForm.rentAmount) || ""}
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
            <h3 className="text-center">Confirm Lease?</h3>
            <p className="text-center my-4">
              Are you sure you want to create this lease? Once the lease
              is created, you will not be able to edit it. You can only delete
              it. The tenant will be notified of the lease creation.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <Button onClick={handleModalClose} color="error">
                Close
              </Button>

              <Button
                onClick={handleCreateLease}
                color="success"
                variant="contained"
              >
                Confirm
              </Button>
            </div>
          </ConfirmModal>
        </div>
      </div>

      <div className="hidden md:block mx-auto mt-10 w-1/3 h-1/2">
        <img className="h-full w-full" src={leaseImage} alt="" />
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

export default CreateLeasePage;
