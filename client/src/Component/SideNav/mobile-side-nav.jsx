import { Drawer, Box, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideNavSection from "./side-nav-section";
import PropTypes from "prop-types";

export const MobileSideNav = (props) => {
  const { toggleSideNav, isSideNavOpen, sections = [] } = props;
  const navigate = useNavigate();

  return (
    <Drawer
      anchor="left"
      open={isSideNavOpen}
      onClose={toggleSideNav}
      ModalProps={{ keepMounted: true }}
      TransitionComponent={Slide}
      transitionDuration={300}
      sx={{
        [`& .MuiDrawer-paper`]: {
          bgcolor: "background.paper",
          color: "text.primary",
          borderRightColor: "divider",
        },
      }}
    >
      <Box sx={{ width: 240 }} role="presentation">
        {sections.map((section, index) => (
          <SideNavSection
            key={index}
            section={section}
            toggleSideNav={toggleSideNav}
          />
        ))}
      </Box>
    </Drawer>
  );
};

MobileSideNav.propTypes = {
  toggleSideNav: PropTypes.func.isRequired,
  isSideNavOpen: PropTypes.bool.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object),
};
