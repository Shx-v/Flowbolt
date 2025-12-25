import {
  Box,
  Drawer,
  MenuItem,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";

const EditProject = ({ open, onClose, handleRefresh, data }) => {
  const { accessToken } = useAuth();

  const handleUpdateProject = async () => {
    try {
      const response = await axios.put(
        `https://flowbolt-mono-be.onrender.com/api/v1/project/${data?.id}`,
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

      if (response.data.status === 200) {
        handleRefresh(response.data?.data);
        toast.success("Project created successfully");
        handleClose();
        formik.resetForm();
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
    enableReinitialize: true,
    initialValues: {
      name: data?.name,
      code: data?.projectCode,
      description: data?.description,
      ownerId: data?.owner?.id,
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdateProject();
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Project Details</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={1}
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProject;
