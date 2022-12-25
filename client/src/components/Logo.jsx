import React from "react";
import logoImg from "../assets/images/logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/"}>
      <img className="w-20 h-12 md:w-24 md:h-14" src={logoImg} alt="" />
    </Link>
  );
};

export default Logo;
