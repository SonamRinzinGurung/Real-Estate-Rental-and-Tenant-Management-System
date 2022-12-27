import { Logo } from "../components";
import { logOut } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
const Homepage = () => {
  const dispatch = useDispatch();
  const logOutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logOut());
  };
  return (
    <div>
      <nav className="flex m-5 shadow-sm justify-center">
        <Logo />
        <div className="flex flex-col justify-center mr-auto">
          <h1 className="font-display text-xl md:text-2xl">Rent Manager</h1>
          <p className="text-xs md:text-sm">
            Find and Manage your rentals in one place
          </p>
        </div>
        <button className="btn bg-tertiary" onClick={logOutUser}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Homepage;
