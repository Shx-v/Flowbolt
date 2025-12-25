import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { accessToken } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  const chartData = [
    { name: "Assigned To Me", count: dashboardData?.assignedTo.length },
    { name: "Assigned By Me", count: dashboardData?.assignedBy.length },
  ];

  const handleGetDashboardData = async () => {
    try {
      const response = await axios.get(
        "https://flowbolt-mono-be.onrender.com/api/v1/dashboard",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === 200) {
        setDashboardData(response.data.data);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    handleGetDashboardData();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3} color="text.primary">
        Dashboard
      </Typography>

      {/* User Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>
            {dashboardData?.user?.firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">
              {dashboardData?.user.firstName} {dashboardData?.user.lastName}
            </Typography>
            <Typography color="text.secondary">
              {dashboardData?.user.role.name}
            </Typography>
            <Typography variant="body2">{dashboardData?.user.email}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Assigned To Me */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Tickets Assigned To Me
              </Typography>
              {dashboardData?.assignedTo.map((t, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography>{t.title}</Typography>
                  <Chip size="small" label={t.priority} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned By Me */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Tickets Assigned By Me
              </Typography>
              {dashboardData?.assignedBy.map((t, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography>{t.title}</Typography>
                  <Chip size="small" label={t.priority} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Simple Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Ticket Overview
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
