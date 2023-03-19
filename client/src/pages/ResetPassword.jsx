import { useEffect, useState, useCallback } from "react";
import { Logo, AlertToast, FormPasswordField } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAlert,
  resetPassword,
  stateClear,
} from "../features/auth/authSlice";

import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const ResetPassword = () => {
  const { user, userType, errorMsg, errorFlag, alertType, isLoading, success } =
    useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  const dispatch = useDispatch();
  const [values, setFormValues] = useState({
    password: "",
    retypedPassword: "",
  });

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
    const { password, retypedPassword } = values;
    const resetInfo = {
      newPassword: password,
      passwordRepeated: retypedPassword,
      role: param.role,
      token: param.token,
    };

    dispatch(resetPassword({ resetInfo }));
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
              <h2 className="">Reset Password</h2>
              <p className="text-gray-600 text-xs md:text-sm">
                Set new password
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8 mt-12">
              <FormPasswordField
                value={values.password}
                handleChange={handleChange}
              />
              <FormPasswordField
                value={values.retypedPassword}
                handleChange={handleChange}
                name="retypedPassword"
                label="Re-type Password"
              />
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
                    "Submit"
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

export default ResetPassword;
