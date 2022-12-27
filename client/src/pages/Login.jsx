import { useEffect, useState, useCallback } from "react";
import { Logo, FormPasswordField, FormTextField } from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAlert,
  loginOwner,
  loginTenant,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import loginImg from "../assets/images/loginImg.svg";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
const Login = () => {
  const { user, errorMsg, errorFlag } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  const vertical = "bottom";
  const horizontal = "right";

  const [values, setFormValues] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;
    const userInfo = {
      email,
      password,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(loginOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(loginTenant({ userInfo }));
    }
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );
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
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img src={loginImg} className="w-full" alt="login banner" />
          </div>
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-6">
                <h4 className="">Login to your account</h4>
              </div>

              <div className="flex flex-col gap-2 mb-2">
                <FormTextField
                  value={values.email}
                  name={"email"}
                  type={"email"}
                  label={"Email"}
                  handleChange={handleChange}
                />
                <FormPasswordField
                  value={values.password}
                  handleChange={handleChange}
                />
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="btn bg-primary w-1/4 text-white font-medium text-sm uppercase hover:bg-primaryDark md:text-base"
                >
                  Login
                </button>
                <p className="text-sm font-medium mt-2 pt-1 mb-0 md:text-base">
                  Don't have an account?{" "}
                  <Link
                    to={`/register/${param.role}`}
                    className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
                  >
                    Register
                  </Link>
                </p>
              </div>
            </form>
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

export default Login;
