import DashboardIcon from "@mui/icons-material/Dashboard";
import WidgetsIcon from "@mui/icons-material/Widgets";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export const useRoutes = () => {
  return [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      title: "Projects",
      path: "/project",
      icon: <WidgetsIcon />,
    },
    {
      title: "Tickets",
      path: "/ticket",
      icon: <FormatListBulletedIcon />,
    },
  ];
};
