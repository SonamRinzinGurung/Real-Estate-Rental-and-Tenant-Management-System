import { useState, useEffect } from "react";
import { Header } from "../components";
import { getAllRealEstate } from "../features/realEstateTenant/realEstateTenantSlice";
import { useDispatch } from "react-redux";
const Homepage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllRealEstate());
  }, [dispatch]);

  const [menuOpen, setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <main></main>
    </div>
  );
};

export default Homepage;
