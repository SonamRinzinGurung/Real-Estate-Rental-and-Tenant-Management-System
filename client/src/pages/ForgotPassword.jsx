import { useEffect, useState, useCallback } from "react";
import { Logo, FormTextField, AlertToast } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAlert,
  forgotPassword,
  stateClear,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";

const ForgotPassword = () => {
  const { user, userType, errorMsg, errorFlag, alertType, isLoading, success } =
    useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  const dispatch = useDispatch();
  const [values, setFormValues] = useState({ email: "" });

  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/login/${param.role}`);
        dispatch(stateClear());
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, param.role, dispatch]);

  // handle form value change
  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  //handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = values;
    const userInfo = {
      email,
      role: param.role,
    };

    dispatch(forgotPassword({ userInfo }));
  };

  //handle alert toast close
  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

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

      <main className="flex flex-col p-6 mt-12 mb-10 mx-auto w-3/4 md:w-3/6 border">
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-6 text-center">
              <HttpsRoundedIcon fontSize="large" />
              <h2 className="">Forgot Password?</h2>
              <p className="text-gray-600 text-xs md:text-sm">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <div className="flex flex-col gap-2 mb-8 mt-12">
              <FormTextField
                value={values.email}
                name={"email"}
                type={"email"}
                label={"Email"}
                handleChange={handleChange}
                autoFocus={true}
              />
            </div>

            <div className="text-center">
              <div className="mx-auto md:w-2/5">
                <Button
                  disabled={isLoading}
                  variant="contained"
                  type="submit"
                  size="medium"
                  color="primary"
                  sx={{
                    color: "white",
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      opacity: [0.9, 0.8, 0.7],
                    },
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
                    "Submit"
                  )}
                </Button>
              </div>
              <p className="text-sm font-medium mt-2 pt-1 mb-0 md:text-base">
                Create new account?{" "}
                <Link
                  to={`/register/${param.role}`}
                  className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
                >
                  Register
                </Link>
              </p>
              <div className="my-4">
                <hr />
              </div>
              <div className="">
                <Link
                  to={`/login/${param.role}`}
                  className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
                >
                  <Button color="tertiary">Back to Login</Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
      <AlertToast
        alertFlag={errorFlag}
        alertMsg={errorMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ForgotPassword;
