import { useEffect } from "react";
import { getAllRealEstate } from "../../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch } from "react-redux";

const Homepage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRealEstate());
  }, [dispatch]);

  return <main></main>;
};

export default Homepage;
