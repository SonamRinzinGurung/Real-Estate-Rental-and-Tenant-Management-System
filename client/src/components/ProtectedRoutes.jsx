import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
};

export default ProtectedRoutes;
