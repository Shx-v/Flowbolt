import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import CreateProject from "./CreateProject";

const Project = () => {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const handleCreateProjectOpen = () => {
    setCreateProjectOpen(true);
  };

  const handleCreateProjectClose = () => {
    setCreateProjectOpen(false);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = projects.map((p) => p.id);
      setSelectedProjects(allIds);
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString) => {
    const date = dayjs(dateString);

    const day = date.date();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${date.format("HH:mm")} ${day}${suffix} ${date.format("MMM YYYY")}`;
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

  const handleGetUsers = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt-mono-be.onrender.com/api/v1/user/list",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.status === 200) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("An error occurred while fetching users.");
    }
  };

  useEffect(() => {
    handleGetProjects();
    handleGetUsers();
  }, []);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography variant="h5" color="text.primary" fontWeight={500}>
            Projects
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateProjectOpen}
        >
          Add
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    selectedProjects.length > 0 &&
                    selectedProjects.length === projects.length
                  }
                  indeterminate={
                    selectedProjects.length > 0 &&
                    selectedProjects.length < projects.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Project Code</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Data
                </TableCell>
              </TableRow>
            )}

            {projects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectRow(project.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1}>
                      {project?.name}
                      {!project?.isActive && (
                        <Tooltip
                          title={
                            "This project is queued for deletion. You will not be able to create tickets or perform other actions on this project."
                          }
                        >
                          <InfoOutlineIcon color="error" />
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`${project?.id}`}
                      sx={{ cursor: "pointer" }}
                    >
                      {project?.projectCode}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {project?.owner
                      ? `${project.owner.firstName} ${project.owner.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {project?.createdBy?.firstName}{" "}
                    {project?.createdBy?.lastName}
                  </TableCell>
                  <TableCell>{formatDate(project?.createdAt)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {projects.length !== 0 && (
          <TablePagination
            component="div"
            count={projects.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
          />
        )}
      </TableContainer>

      <CreateProject
        open={createProjectOpen}
        onClose={handleCreateProjectClose}
        handleRefresh={handleGetProjects}
        users={users}
      />
    </Box>
  );
};

export default Project;
