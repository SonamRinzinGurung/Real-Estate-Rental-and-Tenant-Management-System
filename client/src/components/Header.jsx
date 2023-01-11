import { useCallback, useState } from "react";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Logo, NavBarLinksOwner, NavBarLinksTenant } from "../components";
import { logOut } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";

const Header = ({ toggleMenu, menuOpen }) => {
  const { userType, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const logOutUser = useCallback(() => {
    dispatch(logOut());
  }, [dispatch]);

  const navigate = useNavigate();
  const navigateToProfile = useCallback(() => {
    navigate(`/${userType}/profile`);
  }, [userType, navigate]);

  return (
    <>
      {menuOpen && (
        <section className="modal-container bg-[rgb(0,0,0,0.7)] fixed inset-0 outline-none overflow-x-hidden overflow-y-auto z-10 lg:hidden">
          <div className="modal-dialog relative w-11/12 h-5/6 mx-auto mt-10 pointer-events-none">
            <div className="modal-content border-none shadow-lg relative w-full h-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
              <div className="modal-header flex flex-col flex-shrink-0  items-start p-4 border-b border-gray-200 rounded-t-md">
                <CloseIcon
                  fontSize="large"
                  color="error"
                  onClick={toggleMenu}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "#FF0000",
                    },
                  }}
                />
                <div className="mx-auto">
                  <Logo />
                </div>
              </div>
              <div className="modal-body relative p-4 flex flex-col h-3/4 gap-5">
                {userType === "owner" ? (
                  <NavBarLinksOwner />
                ) : (
                  <NavBarLinksTenant />
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      <header className="flex m-1 shadow-sm justify-center items-center">
        <Logo />
        <div className="flex flex-col justify-center  ml-2 mr-auto">
          <h1 className="font-display text-xl md:text-2xl">Rent Manager</h1>
          <p className="hidden text-xs md:block md:text-sm">
            Find and Manage your rentals in one place
          </p>
        </div>

        <nav className="hidden justify-evenly items-center w-1/3 lg:flex">
          {userType === "owner" ? <NavBarLinksOwner /> : <NavBarLinksTenant />}
        </nav>
        <Tooltip title="Menu">
          <div className="mr-1 lg:hidden">
            <Button
              variant="text"
              size="small"
              sx={{
                color: "black",
                "&:hover": {
                  color: "primary.dark",
                },
              }}
              onClick={toggleMenu}
            >
              <MenuIcon />
            </Button>
          </div>
        </Tooltip>

        <Box
          sx={{
            mr: 2,
          }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                alt={(user?.firstName).toUpperCase()}
                src={user?.profileImage}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              width: 150,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={navigateToProfile}>
            <Avatar
              alt={(user?.firstName).toUpperCase()}
              src={user?.profileImage}
            />
            Profile
          </MenuItem>

          <Divider />

          <MenuItem onClick={logOutUser}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </header>
    </>
  );
};

export default Header;
