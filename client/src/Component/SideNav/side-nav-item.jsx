import {
  ListItemIcon,
  Collapse,
  List,
  Box,
  Typography,
  ButtonBase,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const SideNavItem = ({ item, depth = 1, toggleSideNav }) => {
  const hasChildren = Array.isArray(item.children);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      navigate(item.path);
      if (toggleSideNav) toggleSideNav();
    }
  };

  const isActive = location.pathname.includes(item.path);

  return (
    <>
      <ButtonBase
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          textAlign: "left",
          pl: depth * 2,
          pr: 2,
          py: 1.2,
          borderRadius: 1,
          backgroundColor: isActive ? "action.hover" : "transparent",
          color: isActive ? "primary.main" : "text.primary",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: isActive ? "primary.main" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}
          <Typography
            variant="body2"
            color={isActive ? "primary.main" : "text.primary"}
          >
            {item.title}
          </Typography>
        </Box>

        {hasChildren &&
          (open ? (
            <ExpandLess
              fontSize="small"
              color={isActive ? "primary" : "inherit"}
            />
          ) : (
            <ExpandMore
              fontSize="small"
              color={isActive ? "primary" : "inherit"}
            />
          ))}
      </ButtonBase>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child, index) => (
              <SideNavItem
                key={child.path || index}
                item={child}
                depth={depth + 1}
                toggleSideNav={toggleSideNav}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

SideNavItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string,
    icon: PropTypes.element,
    children: PropTypes.array,
  }).isRequired,
  depth: PropTypes.number,
  toggleSideNav: PropTypes.func,
};

export default SideNavItem;
