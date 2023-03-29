import { useSelector } from "react-redux";
import { Header, Logo, Footer } from "../components";
import { Link } from "react-router-dom";

const PrivacyComponent = () => {
  return (
    <div className="flex flex-col items-center mx-auto w-3/4 mb-12">
      <h2 className="font-heading font-bold mt-8 uppercase">
        Privacy Policies
      </h2>
      <div className="">
        <div className="mt-6">
          <p>
            This application collects, uses and shares personal data in
            accordance with privacy laws to make sure your data protection
            rights are implemented and enforced. This Privacy Policy sets forth
            the basic rules and principles by which we process your personal
            data, and mentions our responsibilities while processing personal
            data.
          </p>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Data Collection</h4>
          <div>
            <p>
              We collect personal information such as name, email address, phone
              number, and property details to provide services to our users.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Use of Data</h4>
          <div>
            <p>
              The collected data will only be used to provide services to our
              users such as managing their properties and contacting potential
              tenants.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Security</h4>
          <div>
            <p>
              We take security measures to protect the collected data from
              unauthorized access, disclosure, or modification.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Data Sharing</h4>
          <div>
            <p>
              We do not share any personal information with third parties
              without the user's explicit consent.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Data Retention</h4>
          <div>
            <p>
              We will retain the collected data for as long as the user is using
              our services or as required by law.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">User Rights</h4>
          <div>
            <p>
              The user has the right to access, modify or delete their personal
              information by contacting us.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-bold">Changes to Policy</h4>
          <div>
            <p>
              We reserve the right to change this privacy policy at any time.
              Users will be notified of any changes via email or through our
              website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacyPoliciesPage = () => {
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
        <PrivacyComponent />
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
      <PrivacyComponent />
      <Footer />
    </div>
  );
};

export default PrivacyPoliciesPage;
