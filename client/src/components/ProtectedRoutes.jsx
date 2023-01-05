import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logOut } from "../features/auth/authSlice";

export const ProtectedRoutesOwner = ({ children }) => {
  const { user, userType } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  if (!user || userType !== "owner") {
    dispatch(logOut());
    return <Navigate to="/" />;
  }
  return children;
};

export const ProtectedRoutesTenant = ({ children }) => {
  const { user, userType } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  if (!user || userType !== "tenant") {
    dispatch(logOut());
    return <Navigate to="/" />;
  }
  return children;
};
