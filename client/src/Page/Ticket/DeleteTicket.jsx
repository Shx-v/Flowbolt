import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteTicket = ({ open, onClose, data }) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://flowbolt-mono-be.onrender.com/api/v1/ticket/${data?.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.status === 200) {
        toast.success("Ticket deleted successfully");
        navigate("/ticket");
      } else {
        toast.error(response.data?.message || "Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    } finally {
        onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
        Delete Ticket
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <strong>{data?.title}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            This action is irreversible. The ticket and all its related data
            will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTicket;
