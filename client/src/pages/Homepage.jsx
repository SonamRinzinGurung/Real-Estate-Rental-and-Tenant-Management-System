import { useState } from "react";
import { Header } from "../components";

const Homepage = () => {
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
