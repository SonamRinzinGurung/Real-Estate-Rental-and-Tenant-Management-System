import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import about1 from "../assets/images/about1.svg";
import about2 from "../assets/images/about2.svg";
import { Link } from "react-router-dom";

const AboutPageComponent = () => {
  return (
    <div className="flex flex-col items-center mx-auto w-3/4 mb-12">
      <h2 className="font-heading font-bold mt-8 uppercase">About</h2>
      <div className="">
        <div className="mt-6">
          <p>
            Property Plus is a real estate management platform that helps you to
            find and manage your rentals in one place. You can either register
            as a property owner or a tenant. The property owner can post their
            property and manage their tenants. The tenant can find properties to
            rent.
          </p>
        </div>
        <div className="flex mt-6 justify-center flex-col md:flex-row">
          <div className="md:w-1/2">
            <h4 className="font-bold">Property Owner</h4>
            <div>
              <p>
                The Property Owner has various functionalities such as posting
                and managing their property, creating rental contracts and rent
                details, managing tenants, registering rent payments, and
                viewing rental payment history. Additionally, they can send
                payment notices to their tenants to ensure timely payments.
              </p>
            </div>
          </div>
          <div>
            <img src={about1} alt="" />
          </div>
        </div>
        <div className="flex mt-6 justify-center flex-col md:flex-row">
          <div className="hidden md:block">
            <img src={about2} alt="" className="max-w-sm" />
          </div>
          <div className="md:w-1/2">
            <h4 className="font-bold">Tenant</h4>
            <div>
              <p>
                The Tenant User can find available properties and contact
                property owners for rental inquiries. They can save properties
                to view later and view the details of potential properties. Once
                they agree to rent a property, they can view and sign the rental
                contract sent to them by the property owner. They can also view
                the payment details, due dates, payment history and receive
                payment reminders from the owner.
              </p>
            </div>
          </div>
          <div className="md:hidden">
            <img src={about2} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
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
        <AboutPageComponent />
        <footer className="p-4 shadow-sm md:px-6 md:py-8 bg-slate-300 mt-auto">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Logo />

              <div className="flex flex-col ml-3 justify-center">
                <h1 className="font-display text-xl md:text-2xl">
                  Rent Manager
                </h1>
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
  }
  return (
    <div>
      <Header />
      <AboutPageComponent />
      <Footer />
    </div>
  );
};

export default AboutPage;
