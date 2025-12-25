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
import { useEffect, useState } from "react";

const CreateTicket = ({ open, onClose, handleRefresh }) => {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState([]);

  const handleCreateTicket = async (values) => {
    try {
      const response = await axios.post(
        "https://flowbolt-mono-be.onrender.com/api/v1/ticket",
        {
          projectId: values.projectId,
          title: values.title,
          description: values.description,
          priority: values.priority,
          type: values.type,
          parentTicket: null,
          assignedTo: values.assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201 || response.data?.status === 201) {
        toast.success("Ticket created successfully");
        handleRefresh();
        handleClose();
      } else {
        toast.error(response.data?.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  };

  const validationSchema = yup.object({
    projectId: yup.string().required("Project ID is required"),
    title: yup
      .string()
      .required("Ticket title is required")
      .min(3, "Minimum 3 characters"),
    description: yup
      .string()
      .required("Description is required")
      .min(5, "Minimum 5 characters"),
    priority: yup.string().required("Priority is required"),
    type: yup.string().required("Type is required"),
    assignedTo: yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectId: "",
      title: "",
      description: "",
      priority: "",
      type: "",
      assignedTo: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleCreateTicket(values);
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleGetProjects = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt-mono-be.onrender.com/api/v1/project",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        setProjects(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("An error occurred while fetching projects.");
    }
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <Box width={420} padding={2}>
        <Typography variant="h5">Create Ticket</Typography>

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          marginTop={2}
        >
          <TextField
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
          />

          <TextField
            label="Description"
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
            select
            label="Project"
            name="projectId"
            value={formik.values.projectId}
            onChange={formik.handleChange}
            fullWidth
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            name="priority"
            value={formik.values.priority}
            onChange={formik.handleChange}
            fullWidth
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </TextField>

          <TextField
            select
            label="Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            fullWidth
          >
            <MenuItem value="Bug">Bug</MenuItem>
            <MenuItem value="Feature Request">Feature Request</MenuItem>
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Improvement">Improvement</MenuItem>
            <MenuItem value="Incident">Incident</MenuItem>
            <MenuItem value="Support">Support</MenuItem>
          </TextField>

          <TextField
            select
            label="Assign To"
            name="assignedTo"
            value={formik.values.assignedTo}
            onChange={formik.handleChange}
            error={
              formik.touched.assignedTo && Boolean(formik.errors.assignedTo)
            }
            helperText={formik.touched.assignedTo && formik.errors.assignedTo}
            fullWidth
          >
            <MenuItem value="3c09d35a-8b4f-467d-bbfa-f28fe0a2b5c8">
              Root Super Admin
            </MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Create Ticket
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreateTicket;
