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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const DeleteProject = ({ open, onClose, data }) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://flowbolt-mono-be.onrender.com/api/v1/project/${data?.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        toast.success("Project deleted successfully");
        navigate("/project");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
        Delete Project
      </DialogTitle>

      <DialogContent>
        <Box mt={1}>
          <Typography variant="body1">
            Are you sure you want to delete <strong>{data?.name}</strong>?
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            This action is irreversible. All tickets and related data will be
            permanently removed.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProject;
