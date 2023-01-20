import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const NavBarLinksOwner = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="text"
        onClick={() => navigate("/owner")}
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
        onClick={() => navigate("/owner/property/post")}
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
        onClick={() => navigate("#")}
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
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="text"
        onClick={() => navigate("/tenant")}
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
        onClick={() => navigate("/tenant/real-estate/all")}
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
        onClick={() => navigate("/tenant/real-estate/saved/all")}
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
