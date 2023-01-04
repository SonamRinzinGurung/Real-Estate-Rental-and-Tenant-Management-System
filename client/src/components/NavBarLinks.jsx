import React from "react";
import { Button } from "@mui/material";

const NavBarLinksOwner = () => {
  return (
    <>
      <Button
        type="text"
        href="/owner"
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

const NavBarLinksTenant = () => {
  return (
    <>
      <Button
        type="text"
        href="/tenant"
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
export { NavBarLinksOwner, NavBarLinksTenant };
