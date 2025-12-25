import {
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import CreateTicket from "./CreateTicket";

const Ticket = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);

  const handleCreateTicketOpen = () => {
    setCreateTicketOpen(true);
  };

  const handleCreateTicketClose = () => {
    setCreateTicketOpen(false);
  };
  const PRIORITY_CONFIG = {
    LOW: {
      label: "Low",
      color: "#4CAF50", // green
    },
    MEDIUM: {
      label: "Medium",
      color: "#FF9800", // orange
    },
    HIGH: {
      label: "High",
      color: "#F44336", // red
    },
    CRITICAL: {
      label: "Critical",
      color: "#9C27B0", // purple
    },
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
      const allIds = tickets.map((p) => p.id);
      setSelectedTickets(allIds);
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleGetTickets = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt-mono-be.onrender.com/api/v1/ticket",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        setTickets(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch Tickets:", error);
      toast.error("An error occurred while fetching Tickets.");
    }
  };

  const PriorityDot = ({ priority, size = 10 }) => {
    const config = PRIORITY_CONFIG[priority];

    if (!config) return null;

    return (
      <Tooltip title={config.label} arrow>
        <Box
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: config.color,
            display: "inline-block",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.08)",
            cursor: "default",
          }}
        />
      </Tooltip>
    );
  };

  useEffect(() => {
    handleGetTickets();
  }, []);

  return (
    <Box padding={3} gap={2} display="flex" flexDirection="column">
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Typography variant="h5" color="text.primary" fontWeight={500}>
            Tickets
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<AddIcon />}
          sx={{ paddingX: 3 }}
          onClick={handleCreateTicketOpen}
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
                    selectedTickets.length > 0 &&
                    selectedTickets.length === tickets.length
                  }
                  indeterminate={
                    selectedTickets.length > 0 &&
                    selectedTickets.length < tickets.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Ticket Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Data
                </TableCell>
              </TableRow>
            )}

            {tickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleSelectRow(ticket.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      <PriorityDot priority={ticket?.priority} />
                      <Typography variant="body2">{ticket?.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Link
                      component={RouterLink}
                      to={`${ticket?.id}`}
                      sx={{ cursor: "pointer" }}
                    >
                      {ticket?.ticketCode}
                    </Link>
                  </TableCell>
                  <TableCell>{ticket?.status}</TableCell>
                  <TableCell>{ticket?.type}</TableCell>
                  <TableCell>
                    {ticket?.assignedBy
                      ? `${ticket.assignedBy.firstName} ${ticket.assignedBy.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {ticket?.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {tickets.length !== 0 && (
          <TablePagination
            component="div"
            count={tickets.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
          />
        )}
      </TableContainer>

      <CreateTicket
        open={createTicketOpen}
        onClose={handleCreateTicketClose}
        handleRefresh={handleGetTickets}
      />
    </Box>
  );
};

export default Ticket;
