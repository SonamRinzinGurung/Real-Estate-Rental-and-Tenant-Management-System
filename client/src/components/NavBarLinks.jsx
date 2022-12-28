import React from "react";
import { Button } from "@mui/material";

const NavBarLinks = () => {
  return (
    <>
      <Button
        type="text"
        href="/"
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
        href="#"
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        About
      </Button>
      <Button
        type="text"
        href="#"
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

export default NavBarLinks;
