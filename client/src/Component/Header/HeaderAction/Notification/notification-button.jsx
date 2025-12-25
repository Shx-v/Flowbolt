import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { usePopover } from "@/Hook/usePopover";
import NotificationPopover from "./notification-popover";
import { Box, IconButton, Badge } from "@mui/material";

const notifications = [
  {
    id: 1,
    title: "Your profile has been updated successfully.",
    timestamp: "Just now",
    type: "success",
  },
  {
    id: 2,
    title: "New login detected from Chrome on Windows.",
    timestamp: "5 mins ago",
    type: "info",
  },
  {
    id: 3,
    title: "Password changed successfully.",
    timestamp: "Today, 9:20 AM",
    type: "success",
  },
  {
    id: 4,
    title: "You have 3 pending tasks to review.",
    timestamp: "Yesterday, 6:45 PM",
    type: "warning",
  },
  {
    id: 5,
    title: "System maintenance scheduled for June 10th.",
    timestamp: "2 days ago",
    type: "info",
  },
  {
    id: 6,
    title: "Your session will expire in 5 minutes.",
    timestamp: "3 days ago",
    type: "warning",
  },
];

export const NotificationButton = () => {
  const popover = usePopover();

  return (
    <Box>
      <IconButton
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ color: "inherit" }}
      >
        <Badge
          badgeContent={notifications.length}
          color="error"
          overlap="circular"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <NotificationPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        notifications={notifications}
      />
    </Box>
  );
};
