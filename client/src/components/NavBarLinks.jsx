import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const NavBarLinksOwner = ({ toggleMenu }) => {
  return (
    <>
      <Link to="/owner" onClick={toggleMenu} className="text-center">
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Home
        </Button>
      </Link>
      <Link
        to="/owner/property/post"
        onClick={toggleMenu}
        className="text-center"
      >
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Post Property
        </Button>
      </Link>
      <Link
        to="/owner/contacts/all"
        onClick={toggleMenu}
        className="text-center"
      >
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Contacts
        </Button>
      </Link>
      <Link to="/owner/rentDetail" onClick={toggleMenu} className="text-center">
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Rent
        </Button>
      </Link>
    </>
  );
};

const NavBarLinksTenant = ({ toggleMenu }) => {
  return (
    <>
      <Link to="/tenant" onClick={toggleMenu} className="text-center">
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Home
        </Button>
      </Link>
      <Link
        to="/tenant/rental-properties/all"
        onClick={toggleMenu}
        className="text-center"
      >
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Rental Properties
        </Button>
      </Link>
      <Link
        to="/tenant/real-estate/saved/all"
        onClick={toggleMenu}
        className="text-center"
      >
        <Button
          type="text"
          sx={{
            color: "black",
            "&:hover": {
              color: "primary.dark",
            },
            width: "100%",
          }}
        >
          Saved
        </Button>
      </Link>
    </>
  );
};

export { NavBarLinksOwner, NavBarLinksTenant };
