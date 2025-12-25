import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { use, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { Link as RouterLink } from "react-router-dom";
import EditProject from "./EditProject";
import ChangeOwner from "./ChangeOwner";
import DeleteProject from "./DeleteProject";
import CreateTicket from "./CreateTicket";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [projectDetail, setProjectDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [changeOwnerOpen, setChangeOwnerOpen] = useState(false);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  const haandleCreateTicketClose = () => {
    setCreateTicketOpen(false);
  };

  const handleCreateTicketOpen = () => {
    setCreateTicketOpen(true);
  };

  const handleDeleteProjectClose = () => {
    setDeleteProjectOpen(false);
  };

  const handleDeleteProjectOpen = () => {
    setDeleteProjectOpen(true);
  };

  const handleChangeOwnerOpen = () => {
    setChangeOwnerOpen(true);
  };

  const handleChangeOwnerClose = () => {
    setChangeOwnerOpen(false);
  };

  const handleEditProjectOpen = () => {
    setEditProjectOpen(true);
  };

  const handleEditProjectClose = () => {
    setEditProjectOpen(false);
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

  const handleGetProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(
        `https://flowbolt-mono-be.onrender.com/api/v1/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        setProjectDetails(response.data.data);
        setTickets(response.data.data.tickets);
        setFilteredTickets(response.data.data.tickets);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to fetch project details");
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

  const statusColor = (status) => {
    switch (status) {
      case "INITIATED":
        return "info";
      case "IN_PROGRESS":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "error";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const TicketCard = ({ ticket }) => {
    return (
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
          height: "100%",
          transition: "0.2s",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardContent>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" color="text.secondary">
              {ticket.ticketCode}
            </Typography>

            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Title */}
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }} noWrap>
            {ticket.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {ticket.description}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          {/* Status & Priority */}
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={ticket.status}
              color={statusColor(ticket.status)}
            />
            <Chip
              size="small"
              label={ticket.priority}
              color={priorityColor(ticket.priority)}
              variant="outlined"
            />
            <Chip size="small" label={ticket.type} variant="outlined" />
          </Stack>

          {/* Footer */}
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const debouncedTicketSearch = (() => {
    let timer;

    return (query, setTickets, delay = 400) => {
      clearTimeout(timer);

      timer = setTimeout(async () => {
        if (!query?.trim()) {
          setTickets(tickets || []);
          return;
        }

        const filteredTicket = tickets.filter(
          (ticket) =>
            ticket.title.toLowerCase().includes(query.toLowerCase()) ||
            ticket.ticketCode.toLowerCase().includes(query.toLowerCase())
        );

        console.log(filteredTicket);

        setTickets(filteredTicket);
      }, delay);
    };
  })();

  useEffect(() => {
    if (projectId) {
      handleGetProjectDetails(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            to="/project"
            underline="none"
            color="inherit"
          >
            <Typography variant="h5">Projects</Typography>
          </Link>

          <Typography color="text.primary" fontWeight={500}>
            {projectDetail?.name ?? "Project Details"}
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateTicketOpen}
          disabled={!projectDetail || !projectDetail?.isActive}
        >
          Create Ticket
        </Button>
      </Stack>

      {!projectDetail?.isActive && projectDetail && (
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <InfoOutlineIcon color="error" />
          <Typography color="error">
            This project is queued for deletion. You will not be able to create
            tickets or perform other actions on this project.
          </Typography>
        </Stack>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Name :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.name ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Project Code :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.projectCode ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Owner :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.owner
                  ? `${projectDetail.owner.firstName} ${projectDetail.owner.lastName}`
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Ticket Count :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {tickets?.length ?? "0"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Created :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {formatDate(projectDetail?.createdAt) ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Updated :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {formatDate(projectDetail?.updatedAt) ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Description :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {projectDetail?.description ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
        <Button
          variant="contained"
          onClick={handleEditProjectOpen}
          disabled={!projectDetail || !projectDetail?.isActive}
        >
          Edit Details
        </Button>
        <Button
          variant="contained"
          onClick={handleChangeOwnerOpen}
          disabled={!projectDetail || !projectDetail?.isActive}
        >
          Change Owner
        </Button>
        <Button
          variant="contained"
          onClick={handleDeleteProjectOpen}
          disabled={!projectDetail || !projectDetail?.isActive}
        >
          Delete
        </Button>
      </Stack>

      <Stack padding={2}>
        <TextField
          placeholder="Search by Ticket Name or Code"
          variant="standard"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          onChange={(e) =>
            debouncedTicketSearch(e.target.value, setFilteredTickets)
          }
        />
      </Stack>

      {filteredTickets.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTickets.map((ticket, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={500}
          align="center"
          marginTop={4}
        >
          No Tickets Available
        </Typography>
      )}

      <EditProject
        data={projectDetail}
        open={editProjectOpen}
        onClose={handleEditProjectClose}
        handleRefresh={setProjectDetails}
      />

      <ChangeOwner
        open={changeOwnerOpen}
        onClose={handleChangeOwnerClose}
        handleRefresh={setProjectDetails}
        data={projectDetail}
        users={users}
      />

      <DeleteProject
        open={deleteProjectOpen}
        onClose={handleDeleteProjectClose}
        data={projectDetail}
      />

      <CreateTicket
        open={createTicketOpen}
        onClose={haandleCreateTicketClose}
        data={projectDetail}
        handleRefresh={handleGetProjectDetails}
        users={users}
      />
    </Box>
  );
};

export default ProjectDetails;
