import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Landing = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 hover:shadow-xl w-auto">
        <h1 className="font-bold text-4xl text-gray-800 font-mono text-center my-4 py-5">
          Welcome to the Landing Page
        </h1>
        <div className="flex justify-center">
          <div className="flex flex-col w-56">
            <h2 className="font-bold text-xl text-gray-800">
              Are you a property owner?
            </h2>
            <div className="flex gap-4 justify-start">
              <Link to="/login/owner">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                  Login
                </button>
              </Link>
              <Link to="/register/owner">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                  Register
                </button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-56">
            <h2 className="font-bold text-xl text-gray-800 my-3">
              Are you a tenant?
            </h2>
            <div className="flex gap-4  justify-start">
              <Link to="/login/tenant">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                  Login
                </button>
              </Link>
              <Link to="/register/tenant">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
