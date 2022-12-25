import { useEffect } from "react";
import { FormRow, Logo } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { loginOwner, loginTenant } from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import loginImg from "../assets/images/loginImg.svg";

const Login = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInfo = {
      email: e.target[0].value,
      password: e.target[1].value,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(loginOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(loginTenant({ userInfo }));
    }
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
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img src={loginImg} className="w-full" alt="login banner" />
          </div>
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center  mb-6">
                <h4 className="">Login to your account</h4>
              </div>

              <FormRow labelName="Email" type="email" />

              <FormRow labelName="Password" type="password" />

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="btn bg-primary w-1/4 text-white font-medium text-sm uppercase  hover:bg-primaryDark md:text-base"
                >
                  Login
                </button>
                <p className="text-sm font-semibold mt-2 pt-1 mb-0 md:text-base">
                  Don't have an account?{" "}
                  <Link
                    to={`/register/${param.role}`}
                    href="#!"
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
    </div>
  );
};

export default Login;
