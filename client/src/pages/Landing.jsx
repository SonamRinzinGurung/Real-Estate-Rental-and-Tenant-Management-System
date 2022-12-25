import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo } from "../components";
import landingImg from "../assets/images/landing1.svg";
import landingImg2 from "../assets/images/landing2.svg";

const Landing = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
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
      <div className="flex justify-evenly shadow-sm">
        <img
          className="hidden w-4/12 rounded-2xl md:block"
          src={landingImg2}
          alt=""
        />
        <div className="flex flex-col self-center p-4 s max-w-2xl">
          <h3 className="font-display">
            Are you looking to rent your property?
          </h3>
          <p className="tracking-wide leading-snug">
            This website allows you to post your property online for potential
            tenants to view
          </p>
          <p className="tracking-wide leading-snug">
            Manage all your tenants in one place
          </p>
          <p className="tracking-wide">Keep track of your tenant's payments</p>
          <div className="flex justify-center mt-7">
            <Link to={"/login/owner"}>
              <button className="btn bg-secondary text-white  rounded-lg w-28 mx-4 hover:bg-secondaryDark">
                Login
              </button>
            </Link>
            <span className="sm:text-2xl">or</span>
            <Link to={"/register/owner"}>
              <button className="btn bg-primary text-white  rounded-lg w-28 mx-4 hover:bg-primaryDark">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-evenly shadow-sm mt-5">
        <img
          className="hidden w-4/12 rounded-2xl md:block"
          src={landingImg}
          alt=""
        />
        <div className="flex flex-col self-center p-4 s max-w-2xl">
          <h3 className=" font-display">
            Are you looking for property to rent?
          </h3>
          <p className=" tracking-wide leading-snug">
            Browse through all kinds of properties for rent
          </p>
          <p className=" tracking-wide leading-snug">
            Use the filters to find the property you are looking for
          </p>
          <p className=" tracking-wide">
            Manges your rental payments and billing information
          </p>
          <div className="flex justify-center mt-7">
            <Link to={"/login/tenant"}>
              <button className="btn bg-secondary text-white rounded-lg w-28 mx-4 hover:bg-secondaryDark">
                Login
              </button>
            </Link>
            <span className="sm:text-2xl">or</span>
            <Link to={"/register/tenant"}>
              <button className="btn bg-tertiary text-white rounded-lg w-28 mx-4 hover:bg-tertiaryDark">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>

      <footer class="p-4 shadow-sm md:px-6 md:py-8 bg-slate-300">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="flex items-center mb-4 sm:mb-0">
            <Logo />

            <div className="flex flex-col ml-3 justify-center">
              <h1 className="font-display text-xl md:text-2xl">Rent Manager</h1>
              <p className="text-xs md:text-sm">
                Find and Manage your rentals in one place
              </p>
            </div>
          </div>
          <ul class="flex flex-wrap items-center mb-6 text-sm sm:mb-0">
            <li>
              <a href="#" class="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" class="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>

            <li>
              <a href="#" class="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr class="my-6 border-gray-700 sm:mx-auto  lg:my-8" />
        <span class="block text-sm  sm:text-center ">
          © 2022{" "}
          <a href="http://localhost:3000" class="hover:underline">
            Property Plus™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

export default Landing;
