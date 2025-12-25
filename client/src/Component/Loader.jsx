import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Loader = ({ open = true }) => {
  return (
    <Backdrop
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "primary.main",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
