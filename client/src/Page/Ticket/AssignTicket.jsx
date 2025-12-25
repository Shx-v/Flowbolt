import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useAuth } from "../../Context/AuthContext";

const AssignTicket = ({ open, onClose, handleRefresh, ticket, users }) => {
  const { accessToken } = useAuth();

  const handleAssignTicket = async (values) => {
    try {
      const response = await axios.post(
        `https://flowbolt-mono-be.onrender.com/api/v1/ticket/assign/${ticket?.id}`,
        {
          assignedTo: values.assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.status === 200) {
        toast.success(response.data?.message || "Ticket assigned successfully");
        handleRefresh(response.data?.data);
        handleClose();
      } else {
        toast.error(response.data?.message || "Failed to assign ticket");
      }
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Failed to assign ticket");
    }
  };

  const validationSchema = yup.object({
    assignedTo: yup.string().required("Assignee is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      assignedTo: ticket?.assignedTo?.id || "",
    },
    validationSchema,
    onSubmit: handleAssignTicket,
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Assign Ticket</DialogTitle>

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
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
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
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTicket;
