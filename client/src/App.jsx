import React, { useState, useMemo } from "react";
import "./App.css";
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  Fab,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRoutes } from "react-router-dom";
import { routes } from "./Route";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { AuthProvider } from "./Context/AuthContext";
import { ToastContainer } from "react-toastify";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
            contrastText: "#fff",
          },
          secondary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
            contrastText: "#fff",
          },
          error: {
            main: "#d32f2f",
            light: "#ef5350",
            dark: "#c62828",
          },
          warning: {
            main: "#ed6c02",
            light: "#ff9800",
            dark: "#e65100",
          },
          info: {
            main: "#0288d1",
            light: "#03a9f4",
            dark: "#01579b",
          },
          success: {
            main: "#2e7d32",
            light: "#4caf50",
            dark: "#1b5e20",
          },
          background: {
            default: "#fafafa",
            paper: "#fff",
          },
          text: {
            primary: "#333",
            secondary: "#666",
            disabled: "#999",
          },
        }
      : {
          primary: {
            main: "#90caf9",
            light: "#a6d4fa",
            dark: "#648dae",
            contrastText: "#000",
          },
          secondary: {
            main: "#ce93d8",
            light: "#e7b8f3",
            dark: "#9c64a6",
            contrastText: "#000",
          },
          error: {
            main: "#f44336",
            light: "#e57373",
            dark: "#d32f2f",
          },
          warning: {
            main: "#ffa726",
            light: "#ffb74d",
            dark: "#f57c00",
          },
          info: {
            main: "#29b6f6",
            light: "#4fc3f7",
            dark: "#0288d1",
          },
          success: {
            main: "#66bb6a",
            light: "#81c784",
            dark: "#388e3c",
          },
          background: {
            default: "#121212",
            paper: "#1d1d1d",
          },
          text: {
            primary: "#fff",
            secondary: "#bbb",
            disabled: "#666",
          },
        }),
  },
});

const App = () => {
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => {
    let baseTheme = createTheme(getDesignTokens(mode));
    baseTheme = responsiveFontSizes(baseTheme);
    return baseTheme;
  }, [mode]);

  const elements = useRoutes(routes);

  const handleToggle = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          {elements}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            theme={mode}
          />
          <Fab
            color="primary"
            aria-label="toggle theme"
            onClick={handleToggle}
            sx={{
              position: "fixed",
              bottom: 16,
              left: 16,
              zIndex: 1000,
            }}
          >
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </Fab>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
