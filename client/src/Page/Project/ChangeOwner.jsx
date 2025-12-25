import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

const ChangeOwner = ({ open, onClose, handleRefresh, data, users }) => {
  const { accessToken } = useAuth();

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };

  const handleUpdateOwner = async (ownerId) => {
    try {
      const response = await axios.put(
        `https://flowbolt-mono-be.onrender.com/api/v1/project/${data?.id}`,
        {
          owner: ownerId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        toast.success(
          response.data?.message || "Project owner updated successfully."
        );
        handleClose();
        handleRefresh(response.data?.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to update project owner.");
    }
  };

  const formik = useFormik({
    initialValues: {
      ownerId: data?.owner?.id,
    },
    validationSchema: Yup.object({
      ownerId: Yup.string().required("Owner is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      handleUpdateOwner(values.ownerId);
      setSubmitting(false);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Project Owner</DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          mt={1}
        >
          <TextField
            label="Select New Owner"
            name="ownerId"
            select
            fullWidth
            value={formik.values.ownerId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
            helperText={formik.touched.ownerId && formik.errors.ownerId}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </TextField>

          {/* hidden submit to allow Enter key */}
          <button type="submit" hidden />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={!formik.isValid || formik.isSubmitting}
        >
          Update Owner
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeOwner;
