import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const NavBarLinksOwner = ({ toggleMenu }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="text"
        onClick={() => {
          navigate("/owner");
          toggleMenu();
        }}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Home
      </Button>
      <Button
        type="text"
        onClick={() => {
          navigate("/owner/property/post");
          toggleMenu();
        }}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Post Property
      </Button>
      <Button
        type="text"
        onClick={() => {
          navigate("#");
          toggleMenu();
        }}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Contact
      </Button>
    </>
  );
};

const NavBarLinksTenant = ({ toggleMenu }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="text"
        onClick={() => {
          navigate("/tenant");
          toggleMenu();
        }}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Home
      </Button>
      <Button
        type="text"
        onClick={() => {
          navigate("/tenant/real-estate/all");
          toggleMenu();
        }}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Browse Property
      </Button>
      <Button
        type="text"
        onClick={() => {
          navigate("/tenant/real-estate/saved/all");
          toggleMenu();
        }}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Saved
      </Button>
    </>
  );
};
export { NavBarLinksOwner, NavBarLinksTenant };
