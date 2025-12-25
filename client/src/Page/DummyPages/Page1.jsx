import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Page1 = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100%"}
    >
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Page 1
        </Typography>
        <Typography variant="body1">This is the Page 1 content.</Typography>
      </Paper>
    </Box>
  );
};

export default Page1;
