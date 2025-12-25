import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Page2 = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Page 2
        </Typography>
        <Typography variant="body1">This is the Page 2 content.</Typography>
      </Paper>
    </Box>
  );
};

export default Page2;
