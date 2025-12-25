import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import { useRoutes } from "@/Config/RouteConfig.jsx";
import Header from "@/Component/Header";
import { MobileSideNav } from "@/Component/SideNav";
import { CommonSideNav } from "@/Component/SideNav";

const HEADER_HEIGHT = 8;
const SIDE_NAV_WIDTH = 30;

const CommonLayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  position: "relative",
  minHeight: "100vh ",
  backgroundColor: theme.palette.background.default,
}));

const CommonLayoutContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "isMobile",
})(({ theme, isMobile }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  paddingTop: theme.spacing(HEADER_HEIGHT),
  paddingLeft: isMobile ? 0 : theme.spacing(SIDE_NAV_WIDTH),
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(["padding-left"], {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const CommonLayout = ({ children }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const routes = useRoutes();
  const theme = useTheme();

  const toggleSideNav = () => setIsSideNavOpen((prev) => !prev);

  return (
    <>
      <Header
        toggleSideNav={toggleSideNav}
        isSideNavOpen={isSideNavOpen}
        loggedIn={true}
      />

      <CommonLayoutRoot>
        {isMobile && (
          <MobileSideNav
            toggleSideNav={toggleSideNav}
            isSideNavOpen={isSideNavOpen}
            sections={routes}
          />
        )}

        {!isMobile && (
          <Box
            sx={{
              position: "fixed",
              top: theme.spacing(HEADER_HEIGHT),
              left: 0,
              width: theme.spacing(SIDE_NAV_WIDTH),
              height: `calc(100vh - ${theme.spacing(HEADER_HEIGHT)})`,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
              zIndex: theme.zIndex.appBar - 1,
            }}
          >
            <CommonSideNav sections={routes} />
          </Box>
        )}

        <CommonLayoutContainer isMobile={isMobile}>
          {children}
        </CommonLayoutContainer>
      </CommonLayoutRoot>
    </>
  );
};
