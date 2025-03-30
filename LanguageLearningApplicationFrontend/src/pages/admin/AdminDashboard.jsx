import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Drawer,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const barData = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
];

const pieData = [
  { name: "Direct", value: 50 },
  { name: "Referral", value: 30 },
  { name: "Social", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      {/* Sidebar Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 240 },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* Permanent Sidebar for Desktop */}
      <Box sx={{ display: { xs: "none", md: "block" }, width: 240 }}>
        <Sidebar />
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Navbar Component */}
        <Navbar title="Admin Dashboard" />
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            display: { md: "none" },
            position: "absolute",
            left: 10,
            top: 10,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Dashboard Content */}
        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8" }}
        >
          {/* Stats Section */}
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            {[
              {
                title: "BUDGET",
                value: "₹24k",
                icon: "₹",
                color: "#7B61FF",
                percentage: "+12%",
                trend: "up",
              },
              {
                title: "TOTAL CUSTOMERS",
                value: "1.6k",
                icon: "👥",
                color: "#1FCB4B",
                percentage: "-16%",
                trend: "down",
              },
              {
                title: "TASK PROGRESS",
                value: "75.5%",
                icon: "📋",
                color: "#FF9F00",
              },
              {
                title: "TOTAL PROFIT",
                value: "₹15k",
                icon: "📊",
                color: "#7B61FF",
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    padding: 3,
                    borderRadius: 3,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: item.color,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 1,
                      color: "#fff",
                      fontSize: 20,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: "#777" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {item.value}
                  </Typography>
                  {item.percentage && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: item.trend === "up" ? "#1FCB4B" : "#FF3D57",
                        fontWeight: "bold",
                      }}
                    >
                      {item.trend === "up" ? "↑" : "↓"} {item.percentage} Since
                      last month
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Paper sx={{ padding: 3 }}>
                <Typography variant="h6">Sales Overview</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={6}>
              <Paper sx={{ padding: 3 }}>
                <Typography variant="h6">Traffic Sources</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
