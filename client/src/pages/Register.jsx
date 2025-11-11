import { useEffect, useState, useCallback } from "react";
import {
  Logo,
  FormTextField,
  FormPasswordField,
  FormSelectField,
  DatePicker,
  CountrySelectField,
  PhoneNumberField,
  ImageDropZone,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  registerOwner,
  registerTenant,
  clearAlert,
  stateClear,
  createAlert,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import registerImg from "../assets/images/registerImg.svg";
import { Button, CircularProgress } from "@mui/material";
import moment from "moment";
import { ageCalculator } from "../utils/valueFormatter";
import useToast from "../hooks/useToast";

const Register = () => {
  const { success, userType, errorFlag, errorMsg, isLoading, alertType } =
    useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();

  useToast({
    alertFlag: errorFlag,
    alertType,
    message: errorMsg,
    clearAlertAction: clearAlert,
  });

  useEffect(() => {
    if (success) {
      navigate(`/account-created/${userType}`);
      dispatch(stateClear());
    }
  }, [navigate, userType, success, dispatch]);

  const [values, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    phoneNumber: "",
    gender: "",
    password: "",
  });

  const [date, setDate] = useState(null);

  // preview image
  const [image, setImage] = useState([]);

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById("form");
    const formData = new FormData(form);
    formData.append("role", param.role);

    if (image.length < 1) {
      dispatch(createAlert("Please upload your profile picture."));
      return;
    }

    formData.append("profileImage", image[0]);
    const dob = moment(date).format("YYYY-MM-DD");
    const age = ageCalculator(dob);
    if (age < 18) {
      dispatch(
        createAlert("You must be 18 years or older to register"))
      return;
    }
    formData.append("dateOfBirth", moment(date).format("YYYY-MM-DD"));

    if (param.role === "owner") {
      dispatch(registerOwner({ formData }));
    } else if (param.role === "tenant") {
      dispatch(registerTenant({ formData }));
    }
  };

  return (
    <div>
      <header className="flex m-1 shadow-sm">
        <Logo />
        <div className="flex flex-col justify-center ml-2">
          <h5 className="font-display">Rent Manager</h5>
          <p className="hidden text-xs md:block md:text-sm">
            Find and Manage your rentals in one place
          </p>
        </div>
      </header>

      <main className="px-6 h-full mt-12 mb-12">
        <div className="flex md:justify-around justify-center g-6">
            <form onSubmit={handleSubmit} id="form">
            <div className="flex flex-col w-full gap-6">
              <div className="flex justify-center w-full">
                <h3 className="text-center">Register for your new account</h3>
              </div>
              <div className="flex flex-col gap-4 justify-center w-full">
                <FormTextField
                  label="First Name"
                  name="firstName"
                  type={"text"}
                  value={values.firstName}
                  handleChange={handleChange}
                  autoFocus={true}
                />
                <FormTextField
                  label="Last Name"
                  name="lastName"
                  type={"text"}
                  value={values.lastName}
                  handleChange={handleChange}
                />
                <FormTextField
                  label="Email"
                  name="email"
                  type={"email"}
                  value={values.email}
                  handleChange={handleChange}
                />
                <FormTextField
                  label="Address"
                  name="address"
                  type={"text"}
                  value={values.address}
                  handleChange={handleChange}
                />
                <FormTextField
                  label="City"
                  name="city"
                  type={"text"}
                  value={values.city}
                  handleChange={handleChange}
                />
                <CountrySelectField
                  value={values.country}
                  setFormValues={setFormValues}
                  handleChange={handleChange}
                />

                <PhoneNumberField
                  value={values.phoneNumber}
                  handleChange={
                    (fullPhone) => {
                      setFormValues({
                        ...values,
                        phoneNumber: fullPhone,
                      });
                    }
                  }
                />
                <DatePicker
                  value={date}
                  label="Date of Birth"
                  handleChange={useCallback(
                    (date) => {
                      setDate(date);
                    },
                    [setDate]
                  )}
                />
                <FormSelectField
                  label="Gender"
                  name="gender"
                  options={["Male", "Female", "Other"]}
                  value={values.gender}
                  handleChange={handleChange}
                />

                <ImageDropZone
                  fileState={image}
                  setFileState={setImage}
                  label="Profile Picture"
                />
                <FormPasswordField
                  value={values.password}
                  handleChange={handleChange}
                />
              </div>

              <div className="text-center mt-10">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  disabled={isLoading}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      opacity: [0.9, 0.8, 0.7],
                    },
                    width: "100%",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={26}
                      sx={{
                        color: "#fff",
                      }}
                    />
                  ) : (
                    "Register"
                  )}
                </Button>
                <p className="text-sm font-medium mt-4 md:text-base">
                  Already have an account?{" "}
                  <Link
                    to={`/login/${param.role}`}
                    className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
            </form>
          <div className="hidden mb-12 md:mb-0 md:block mt-8 w-1/2">
            <img src={registerImg} className="w-full" alt="login banner" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
