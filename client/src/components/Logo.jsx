import React from "react";
import logoImg from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Logo = () => {
  const { userType } = useSelector((store) => store.auth);
  return (
    <Link to={`/${userType ? userType : ""}`}>
      <img
        className="w-16 h-10 md:w-20 md:h-12"
        src={logoImg}
        alt="Property Plus Logo"
      />
    </Link>
  );
};

export default Logo;
