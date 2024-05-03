import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logOut } from "../features/auth/authSlice";


const ProtectedRoutes = ({ children, source }) => {
  const { user, userType } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  if (!user || userType !== source) {
    dispatch(logOut());
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoutes;
