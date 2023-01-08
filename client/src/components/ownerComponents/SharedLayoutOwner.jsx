import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "..";

const SharedLayoutOwner = () => {
  const [menuOpen, setOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleMenu={toggleMenu} menuOpen={menuOpen} />
      <Outlet />
    </div>
  );
};

export default SharedLayoutOwner;
