import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { NotificationButton } from "./HeaderAction/Notification";
import { ProfileButton } from "./HeaderAction/Profile";
import PropTypes from "prop-types";

const Header = (props) => {
  const { toggleSideNav, isSideNavOpen, loggedIn = false } = props;
  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        color: (theme) => theme.palette.text.primary,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: "none" } }}
          onClick={toggleSideNav}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          FlowBolt
        </Typography>
        {loggedIn && (
          <Box sx={{ display: { xs: "flex", md: "flex" }, gap: 2 }}>
            {/* <NotificationButton /> */}
            <ProfileButton />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  toggleSideNav: PropTypes.func.isRequired,
  isSideNavOpen: PropTypes.bool,
  loggedIn: PropTypes.bool,
};

export default Header;
