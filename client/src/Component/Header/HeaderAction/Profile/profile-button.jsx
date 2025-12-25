import { Avatar, Box } from "@mui/material";
import { usePopover } from "@/Hook/usePopover";
import ProfilePopover from "./profile-popover";

export const ProfileButton = () => {
  const popover = usePopover();

  return (
    <Box>
      <Box
        ref={popover.anchorRef}
        onClick={popover.handleOpen}
        sx={{
          borderWidth: 2,
          borderColor: "gray",
          borderStyle: "solid",
          borderRadius: "50%",
          display: "inline-flex",
          bgcolor: "background.paper",
          cursor: "pointer",
          color: "text.primary",
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            margin: 0.3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        />
      </Box>
      <ProfilePopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </Box>
  );
};
