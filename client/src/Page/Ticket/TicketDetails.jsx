import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import EditTicket from "./EditTicket";
import AssignTicket from "./AssignTicket";
import CreateSubTicket from "./CreateSubTicket";
import DeleteTicket from "./DeleteTicket";

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { accessToken, userDetails } = useAuth();
  const navigate = useNavigate();
  const [ticketDetail, setTicketDetail] = useState(null);
  const [users, setUsers] = useState([]);
  const [childrenTickets, setChildrenTickets] = useState([]);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [assignTicketOpen, setAssignTicketOpen] = useState(false);
  const [createSubTicketOpen, setCreateSubTicketOpen] = useState(false);
  const [deleteTicketOpen, setDeleteTicketOpen] = useState(false);

  const handleDeleteTicketClose = () => {
    setDeleteTicketOpen(false);
  };

  const handleDeleteTicketOpen = () => {
    setDeleteTicketOpen(true);
  };

  const handleCreateSubTicketClose = () => {
    setCreateSubTicketOpen(false);
  };

  const handleCreateSubTicketOpen = () => {
    setCreateSubTicketOpen(true);
  };

  const handleAssignTicketClose = () => {
    setAssignTicketOpen(false);
  };

  const handleAssignTicketOpen = () => {
    setAssignTicketOpen(true);
  };

  const handleEditTicketOpen = () => {
    setEditTicketOpen(true);
  };

  const handleEditTicketClose = () => {
    setEditTicketOpen(false);
  };

  const handleGetTicketDetails = async (ticketId) => {
    try {
      const response = await axios.get(
        `https://flowbolt-mono-be.onrender.com/api/v1/ticket/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        setTicketDetail(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to fetch project details");
    }
  };

  const handleGetChildrenTickets = async (ticketId) => {
    try {
      const response = await axios.get(
        `https://flowbolt-mono-be.onrender.com/api/v1/ticket/${ticketId}/children`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        setChildrenTickets(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error(
        error.response.data?.message || "Failed to fetch child tickets"
      );
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(
        `https://flowbolt-mono-be.onrender.com/api/v1/ticket/${ticketId}/status/${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        toast.success(
          response.data.message || "Ticket status updated successfully"
        );
        setTicketDetail(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to update ticket status");
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update ticket status");
    }
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
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "success";
      default:
        return "default";
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

  const nextStatus = (currentStatus) => {
    const hasCreatePermission = Boolean(
      userDetails?.permissions.find((perm) => perm.name === "UPDATE_TICKET")
    );

    switch (currentStatus) {
      case "Created":
        return hasCreatePermission
          ? [{ label: "Cancel", value: "Cancelled" }]
          : [];

      case "Assigned":
        return hasCreatePermission
          ? [
              { label: "Start Progress", value: "In Progress" },
              { label: "Cancel", value: "Cancelled" },
            ]
          : [{ label: "Start Progress", value: "In Progress" }];

      case "In Progress":
        return [
          { label: "Send for Review", value: "In Review" },
          { label: "Block Ticket", value: "Blocked" },
        ];

      case "Blocked":
        return [{ label: "Resume Progress", value: "In Progress" }];

      case "In Review":
        return hasCreatePermission
          ? [
              { label: "Mark as Done", value: "Done" },
              { label: "Reopen Ticket", value: "Reopened" },
            ]
          : [];

      case "Done":
        return hasCreatePermission
          ? [{ label: "Reopen Ticket", value: "Reopened" }]
          : [];

      case "Reopened":
        return [{ label: "Start Progress", value: "In Progress" }];

      case "Cancelled":
        return [];

      default:
        return [];
    }
  };

  useEffect(() => {
    handleGetTicketDetails(ticketId);
    handleGetChildrenTickets(ticketId);
    handleGetUsers();
  }, [ticketId]);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            to="/ticket"
            underline="none"
            color="inherit"
          >
            <Typography variant="h5">Tickets</Typography>
          </Link>

          <Typography color="text.primary" fontWeight={500}>
            {ticketDetail?.title ?? "Ticket Details"}
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateSubTicketOpen}
          disabled={!ticketDetail}
        >
          Create Sub Ticket
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Ticket Code :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.ticketCode ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Priority :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.priority ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Type :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.type ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Status :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.status ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Assigned To :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.assignedTo
                  ? `${ticketDetail.assignedTo.firstName} ${ticketDetail.assignedTo.lastName}`
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid container>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography color="text.secondary" align="left">
                Assigned By :
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography color="text.primary" align="left">
                {ticketDetail?.assignedBy
                  ? `${ticketDetail.assignedBy.firstName} ${ticketDetail.assignedBy.lastName}`
                  : "N/A"}
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
                {formatDate(ticketDetail?.createdAt) ?? "N/A"}
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
                {formatDate(ticketDetail?.updatedAt) ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
        <Button
          variant="contained"
          disabled={!ticketDetail}
          onClick={handleEditTicketOpen}
        >
          Edit Details
        </Button>
        <Button
          variant="contained"
          disabled={!ticketDetail}
          onClick={handleAssignTicketOpen}
        >
          {ticketDetail?.assignedTo ? "Reassign" : "Assign"}
        </Button>

        {ticketDetail?.parentTicket && (
          <Button
            variant="contained"
            onClick={() => navigate(`/ticket/${ticketDetail?.parentTicket}`)}
          >
            View Parent Ticket
          </Button>
        )}

        {nextStatus(ticketDetail?.status).map((status) => (
          <Button
            key={status.value}
            variant="contained"
            onClick={() => handleStatusChange(status.value)}
          >
            {status.label}
          </Button>
        ))}

        <Button
          variant="contained"
          disabled={!ticketDetail}
          onClick={handleDeleteTicketOpen}
        >
          Delete
        </Button>
      </Stack>

      <Typography color="text.primary">{ticketDetail?.description}</Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {childrenTickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/ticket/${ticket.id}`)}
              >
                <TableCell>{ticket.ticketCode}</TableCell>

                <TableCell>{ticket.title}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={ticket.status}
                    color={statusColor(ticket.status)}
                  />
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={ticket.priority}
                    color={priorityColor(ticket.priority)}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>{ticket.type}</TableCell>

                <TableCell>
                  {ticket.assignedTo
                    ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                    : "Unassigned"}
                </TableCell>

                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {childrenTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Child Tickets
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <EditTicket
        open={editTicketOpen}
        onClose={handleEditTicketClose}
        ticket={ticketDetail}
        handleRefresh={setTicketDetail}
      />

      <AssignTicket
        open={assignTicketOpen}
        onClose={handleAssignTicketClose}
        ticket={ticketDetail}
        handleRefresh={setTicketDetail}
        users={users}
      />

      <CreateSubTicket
        open={createSubTicketOpen}
        onClose={handleCreateSubTicketClose}
        handleRefresh={handleGetChildrenTickets}
        ticket={ticketDetail}
        users={users}
      />

      <DeleteTicket
        open={deleteTicketOpen}
        onClose={handleDeleteTicketClose}
        data={ticketDetail}
      />
    </Box>
  );
};

export default TicketDetails;
