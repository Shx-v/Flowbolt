import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: (values) => {
      console.log("Login values:", values);
      handleLogin(values);
    },
  });

  const handleLogin = async () => {
    try {
      const credentials = `${formik.values.username}:${formik.values.password}`;
      const encodedCredentials = btoa(credentials);

      const response = await axios.post(
        "https://flowbolt-mono-be.onrender.com/api/v1/auth/login",
        {},
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login successful:", response.data);

      if (response.data.status === 200) {
        toast.success(response.data.message);
        handleGetUserDetails(response.data.data);
        // navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed !");
    }
  };

  const handleGetUserDetails = async (token) => {
    try {
      const response = await axios.get(
        "https://flowbolt-mono-be.onrender.com/api/v1/user/detail",
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      console.log("User details fetched:", response.data);
      if (response.data.status === 200) {
        login(token, response.data.data);
        navigate("/dashboard");
      } else {
        toast.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Paper
        elevation={3}
        sx={{ paddingY: 12, paddingX: 8, width: { xs: 200, sm: 350 } }}
      >
        <Typography variant="h5" textAlign="center" mb={3}>
          Login
        </Typography>

        <TextField
          fullWidth
          size={isSmall ? "small" : "medium"}
          margin="normal"
          label="Username"
          name="username"
          variant="outlined"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <FormControl
          fullWidth
          size={isSmall ? "small" : "medium"}
          variant="outlined"
          margin="normal"
          error={formik.touched.password && Boolean(formik.errors.password)}
        >
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  size={isSmall ? "small" : "medium"}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <FormHelperText>
            {formik.touched.password && formik.errors.password}
          </FormHelperText>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
          onClick={formik.handleSubmit}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
