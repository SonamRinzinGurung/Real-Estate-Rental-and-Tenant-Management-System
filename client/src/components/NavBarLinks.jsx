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
        href="/owner/property/post"
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
        href="/tenant/real-estate/all"
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
