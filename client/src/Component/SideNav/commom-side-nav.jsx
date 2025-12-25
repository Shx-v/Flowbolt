import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import SideNavSection from "./side-nav-section";
import PropTypes from "prop-types";

const drawerWidth = 240;

export const CommonSideNav = (props) => {
  const { sections } = props;
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          paddingTop: "65px",
          bgcolor: "background.paper",
          color: "text.primary",
          borderRightColor: "divider",
        },
      }}
    >
      {sections.map((section, index) => (
        <SideNavSection key={index} section={section} />
      ))}
    </Drawer>
  );
};

CommonSideNav.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
};
