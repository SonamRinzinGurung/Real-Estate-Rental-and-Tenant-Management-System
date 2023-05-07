import { useEffect, useCallback } from "react";
import { Logo, AlertToast } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAlert,
  stateClear,
  verifyAccountOwner,
} from "../features/auth/authSlice";

import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import verifyEmailImage from "../assets/images/verifyEmail.png";

const VerifyEmailPage = () => {
  const { user, userType, errorMsg, errorFlag, alertType, isLoading, success } =
    useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  const dispatch = useDispatch();

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

  //handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const verifyInfo = {
      role: param.role,
      token: param.token,
    };

    dispatch(verifyAccountOwner({ verifyInfo }));
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

      <main className="flex flex-col p-6 mt-16 mb-10 mx-auto w-3/4 md:w-3/6 border">
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-1/5">
                <img src={verifyEmailImage} alt="email verification" />
              </div>
              <h1 className="">Email Verification</h1>
              <p className="text-gray-900 text-sm md:text-base">
                Click the button below to verify your email address and activate
                your account.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto md:w-2/5">
                <Button
                  disabled={isLoading || (errorFlag && alertType === "success")}
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
                    "Verify Email"
                  )}
                </Button>
              </div>

              <div className="mt-6 mb-4">
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

export default VerifyEmailPage;
