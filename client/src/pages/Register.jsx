import { useEffect, useState, useCallback } from "react";
import {
  Logo,
  FormTextField,
  FormPasswordField,
  FormSelectField,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  registerOwner,
  registerTenant,
  clearAlert,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import registerImg from "../assets/images/registerImg.svg";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
  const { user, errorFlag, errorMsg, isLoading } = useSelector(
    (store) => store.auth
  );
  const navigate = useNavigate();
  const param = useParams();

  const vertical = "bottom";
  const horizontal = "left";

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const [values, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    age: "",
    gender: "",
    password: "",
  });

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      age,
      gender,
      password,
    } = values;
    const userInfo = {
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
      age,
      gender,
      password,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(registerOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(registerTenant({ userInfo }));
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearAlert());
  };

  return (
    <div>
      <nav className="flex m-5 shadow-sm">
        <Logo />
        <div className="flex flex-col justify-center ml-2">
          <h1 className="font-display text-xl md:text-2xl">Rent Manager</h1>
          <p className="text-xs md:text-sm">
            Find and Manage your rentals in one place
          </p>
        </div>
      </nav>

      <div className="px-6 h-full">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mt-3 mb-4">
                <h4 className="">Register for your new account</h4>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <FormTextField
                  label="First Name"
                  name="firstName"
                  type={"text"}
                  value={values.firstName}
                  handleChange={handleChange}
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
                  label="Phone Number"
                  name="phoneNumber"
                  type={"number"}
                  value={values.phoneNumber}
                  handleChange={handleChange}
                />

                <FormSelectField
                  label="Age"
                  name="age"
                  options={Array.from(new Array(100), (x, i) => i + 16)}
                  value={values.age}
                  handleChange={handleChange}
                />
                <FormSelectField
                  label="Gender"
                  name="gender"
                  options={["Male", "Female", "Other"]}
                  value={values.gender}
                  handleChange={handleChange}
                />
              </div>
              <div className="w-1/2 mx-auto mt-2">
                <FormPasswordField
                  value={values.password}
                  handleChange={handleChange}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn bg-primary w-1/4 text-white font-medium text-sm uppercase mt-2 hover:bg-primaryDark md:text-base"
                >
                  {isLoading ? (
                    <CircularProgress
                      size={22}
                      sx={{
                        color: "tertiary.dark",
                      }}
                    />
                  ) : (
                    "Register"
                  )}
                </button>
                <p className="text-sm font-medium mt-2 pt-1 mb-0 md:text-base">
                  Already have an account?{" "}
                  <Link
                    to={`/login/${param.role}`}
                    className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <div className="hidden grow-0 shrink-1 md:shrink-0 basis-auto lg:w-6/12 md:w-9/12 mb-12 md:mb-0 sm:block">
            <img src={registerImg} className="w-full" alt="login banner" />
          </div>
        </div>
      </div>
      <Snackbar
        open={errorFlag}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert severity="error" sx={{ width: "250px" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
