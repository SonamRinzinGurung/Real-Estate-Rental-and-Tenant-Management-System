import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";

const SharedLayoutTenant = () => {
  const [menuOpen, setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <Outlet />;
    </>
  );
};

export default SharedLayoutTenant;
