import { FormRow, FormSelect, Logo } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { registerOwner, registerTenant } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import registerImg from "../assets/images/registerImg.svg";

const Register = () => {
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
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      address: e.target[3].value,
      phoneNumber: e.target[4].value,
      age: e.target[5].value,
      gender: e.target[6].value,
      password: e.target[7].value,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(registerOwner({ userInfo }));
    } else if (param.role === "tenant") {
      dispatch(registerTenant({ userInfo }));
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
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mt-3 mb-4">
                <h4 className="">Register for your new account</h4>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <FormRow labelName="first name" type="text" />
                <FormRow labelName="last name" type="text" />
                <FormRow labelName="email" type="email" />
                <FormRow labelName="address" type="text" />
                <FormRow labelName="phone number" type="text" />
                <FormRow labelName="age" type="text" />
                <FormSelect
                  labelName="gender"
                  options={["male", "female", "other"]}
                />
              </div>
              <div className="w-1/2 mx-auto">
                <FormRow labelName="password" type="password" />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn bg-primary w-1/4 text-white font-medium text-sm uppercase mt-2 hover:bg-primaryDark md:text-base"
                >
                  Register
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
    </div>
  );
};

export default Register;
