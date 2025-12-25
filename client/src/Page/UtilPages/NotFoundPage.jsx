import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        gap: 2,
        textAlign: "center",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 60, color: "error.main" }} />
      <Typography variant="h4" fontWeight={600}>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary">
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
        Go Back
      </Button>
    </Box>
  );
};

export default NotFoundPage;
