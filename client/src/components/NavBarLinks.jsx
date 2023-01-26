import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBarLinksOwner = ({ toggleMenu }) => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        type="text"
        onClick={useCallback(() => {
          navigate("/owner");
          toggleMenu();
        }, [navigate, toggleMenu])}
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
        onClick={useCallback(() => {
          navigate("/owner/property/post");
          toggleMenu();
        }, [navigate, toggleMenu])}
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
        onClick={useCallback(() => {
          navigate("/owner/contacts/all");
          toggleMenu();
        }, [navigate, toggleMenu])}
        sx={{
          color: "black",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        Contacts
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
        onClick={useCallback(() => {
          navigate("/tenant");
          toggleMenu();
        }, [navigate, toggleMenu])}
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
        onClick={useCallback(() => {
          navigate("/tenant/real-estate/all");
          toggleMenu();
        }, [navigate, toggleMenu])}
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
        onClick={useCallback(() => {
          navigate("/tenant/real-estate/saved/all");
          toggleMenu();
        }, [navigate, toggleMenu])}
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
