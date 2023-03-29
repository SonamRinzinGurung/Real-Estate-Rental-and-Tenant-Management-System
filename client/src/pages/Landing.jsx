import { useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Logo } from "../components";
import landingImg from "../assets/images/landing1.svg";
import landingImg2 from "../assets/images/landing2.svg";
import { Button } from "@mui/material";

const Landing = () => {
  const { user, userType } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex m-1 shadow-sm">
        <Logo />
        <div className="flex flex-col justify-center ml-2">
          <h5 className="font-display">Rent Manager</h5>
          <p className="hidden text-xs md:block md:text-sm">
            Find and Manage your rentals in one place
          </p>
        </div>
      </header>
      <main className="">
        <section className="flex gap-8 md:ml-6 shadow-sm">
          <img
            className="hidden w-80 rounded-2xl md:block"
            src={landingImg2}
            alt=""
          />
          <div className="flex flex-col self-center mx-auto p-4 w-full md:ml-16">
            <h4 className="font-display">
              Are you looking to rent your property?
            </h4>
            <p className="tracking-wide leading-snug">
              This website allows you to post your property online for potential
              tenants to view
            </p>
            <p className="tracking-wide leading-snug">
              Manage all your tenants in one place
            </p>
            <p className="tracking-wide">
              Keep track of your tenant's payments
            </p>
            <div className="flex justify-start mt-7">
              <Button
                onClick={useCallback(
                  () => navigate("/login/owner"),
                  [navigate]
                )}
                variant="contained"
                size="medium"
                color="secondary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Login
              </Button>
              <span className="mx-3 sm:text-2xl">|</span>

              <Button
                onClick={useCallback(
                  () => navigate("/register/owner"),
                  [navigate]
                )}
                variant="contained"
                size="medium"
                color="primary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Register
              </Button>
            </div>
          </div>
        </section>
        <section className="flex  gap-8 md:ml-6 shadow-sm mt-5">
          <img
            className="hidden w-80 rounded-2xl md:block"
            src={landingImg}
            alt=""
          />
          <div className="flex flex-col self-center mx-auto p-4 w-full md:ml-16">
            <h4 className=" font-display">
              Are you looking for property to rent?
            </h4>
            <p className=" tracking-wide leading-snug">
              Browse through all kinds of properties for rent
            </p>
            <p className=" tracking-wide leading-snug">
              Use the filters to find the property you are looking for
            </p>
            <p className=" tracking-wide">
              Manges your rental payments and billing information
            </p>
            <div className="flex justify-start mt-7">
              <Button
                onClick={useCallback(
                  () => navigate("/login/tenant"),
                  [navigate]
                )}
                variant="contained"
                size="medium"
                color="secondary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Login
              </Button>
              <span className="mx-3 sm:text-2xl">|</span>
              <Button
                onClick={useCallback(
                  () => navigate("/register/tenant"),
                  [navigate]
                )}
                variant="contained"
                size="medium"
                color="tertiary"
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "tertiary.dark",
                    opacity: [0.9, 0.8, 0.7],
                  },
                }}
              >
                Register
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-4 shadow-sm md:px-6 md:py-8 bg-slate-300 mt-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Logo />

            <div className="flex flex-col ml-3 justify-center">
              <h1 className="font-display text-xl md:text-2xl">Rent Manager</h1>
              <p className="text-xs md:text-sm">
                Find and Manage your rentals in one place
              </p>
            </div>
          </div>
          <ul className="flex flex-wrap items-center mb-6 text-sm sm:mb-0">
            <li>
              <Link to="/about" className="mr-4 hover:underline md:mr-6 ">
                About
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-700 sm:mx-auto  lg:my-8" />
        <span className="block text-sm  sm:text-center ">
          2023 |{" "}
          <Link to="/" className="hover:underline">
            Property Plus
          </Link>
        </span>
      </footer>
    </div>
  );
};

export default Landing;
