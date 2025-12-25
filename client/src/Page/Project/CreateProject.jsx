import {
  Box,
  Drawer,
  MenuItem,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";

const CreateProject = ({ open, onClose, handleRefresh, users }) => {
  const { accessToken } = useAuth();

  const handleCreateProject = async () => {
    try {
      const response = await axios.post(
        "https://flowbolt-mono-be.onrender.com/api/v1/project",
        {
          name: formik.values.name,
          projectCode: formik.values.code,
          description: formik.values.description,
          owner: formik.values.ownerId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 201) {
        handleRefresh();
        toast.success("Project created successfully");
        handleClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .required("Project name is required")
      .min(3, "Minimum 3 characters"),
    code: yup
      .string()
      .required("Project code is required")
      .matches(
        /^[A-Z0-9-_]+$/,
        "Only uppercase letters, numbers, - and _ allowed"
      ),
    description: yup
      .string()
      .required("Project description is required")
      .min(10, "Minimum 10 characters"),
    ownerId: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
      ownerId: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateProject();
      formik.resetForm();
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <Box width={400} padding={2}>
        <Typography variant="h5">Create Project</Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={2}
        >
          <TextField
            label="Project Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
          />

          <TextField
            label="Project Code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            fullWidth
          />

          <TextField
            label="Project Description"
            name="description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
          />

          <TextField
            label="Select Owner"
            name="ownerId"
            select
            value={formik.values.ownerId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
            helperText={formik.touched.ownerId && formik.errors.ownerId}
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Create Project
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateProject;
