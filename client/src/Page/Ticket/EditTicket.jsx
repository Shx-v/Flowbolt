import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const EditTicket = ({ open, onClose, handleRefresh, ticket }) => {
  const { accessToken } = useAuth();

  const handleUpdateTicket = async (values) => {
    try {
      const response = await axios.put(
        `https://flowbolt-mono-be.onrender.com/api/v1/ticket/${ticket?.id}`,
        {
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          type: values.type,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.status === 200) {
        toast.success(response.data?.message || "Ticket updated successfully");
        handleRefresh(response.data?.data);
        handleClose();
      } else {
        toast.error(response.data?.message || "Failed to update ticket");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket");
    }
  };

  const validationSchema = yup.object({
    title: yup.string().required("Title is required").min(3),
    description: yup.string().required("Description is required").min(5),
    status: yup.string().required(),
    priority: yup.string().required(),
    type: yup.string().required(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: ticket?.title || "",
      description: ticket?.description || "",
      status: ticket?.status || "INITIATED",
      priority: ticket?.priority || "HIGH",
      type: ticket?.type || "BUG",
    },
    validationSchema,
    onSubmit: handleUpdateTicket,
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Ticket</DialogTitle>

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
            label="Ticket"
            value={`${ticket?.ticketCode} - ${ticket?.title}`}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            fullWidth
          />

          <TextField
            label="Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
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
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
          />

          <TextField
            select
            label="Status"
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            fullWidth
          >
            <MenuItem value="Initiated">Initiated</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="In Review">In Review</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Update Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicket;
