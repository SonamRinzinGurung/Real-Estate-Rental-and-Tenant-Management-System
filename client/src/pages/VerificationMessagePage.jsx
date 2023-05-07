import { useEffect, useCallback } from "react";
import { Logo, AlertToast } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  resendVerificationEmail,
  clearAlert,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const VerificationMessagePage = () => {
  const { user, userType, errorMsg, errorFlag, alertType, isLoading } =
    useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  const dispatch = useDispatch();

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);

  const handleResendVerificationEmail = useCallback(() => {
    const resendInfo = {
      role: param.role,
      email: email,
    };
    dispatch(resendVerificationEmail({ resendInfo }));
  }, [dispatch, email, param.role]);

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
        <div className="flex flex-col items-center mb-6 text-center">
          <MarkEmailReadIcon fontSize="large" color="success" />
          <h1 className="">Account Created but not Verified</h1>
          <p className="text-gray-600 text-base md:text-xl">
            Please check your email for verification link to activate your
            account.
          </p>
          <div className="mt-8">
            <span className="text-gray-600 text-base md:text-xl">
              Didn't receive the email?
            </span>
            <Button
              disabled={isLoading || (errorFlag && alertType === "success")}
              type="submit"
              size="medium"
              color="tertiary"
              onClick={handleResendVerificationEmail}
            >
              {isLoading ? (
                <CircularProgress size={26} color="tertiary" />
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </div>
        </div>
        <div className="text-center">
          <div className="my-4">
            <hr />
          </div>
          <div className="mx-auto md:w-2/5">
            <Link
              to={`/login/${param.role}`}
              className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
            >
              <Button
                size="large"
                variant="contained"
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
                Back to Login
              </Button>
            </Link>
          </div>
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

export default VerificationMessagePage;
