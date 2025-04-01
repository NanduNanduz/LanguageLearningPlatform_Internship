import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PaymentIcon from "@mui/icons-material/Payment";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: " #dadad6",
          color: "#fff",
        },
      }}
    >
      {/* Logo & Branding */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
          backgroundColor: " #dadad6",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", letterSpacing: "1px", color: " #4e9fa8" }}
        >
          Fluencia
        </Typography>
      </Toolbar>

      <List>
        <ListItem button component={Link} to="/adminDashboard">
          <ListItemIcon sx={{ color: " #4e9fa8" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ color: "black" }} />
        </ListItem>
        <ListItem button component={Link} to="/student-management">
          <ListItemIcon sx={{ color: "#4e9fa8" }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Students" sx={{ color: "black" }} />
        </ListItem>
        <ListItem button component={Link} to="/instructor-management">
          <ListItemIcon sx={{ color: "#4e9fa8" }}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Instructors" sx={{ color: "black" }} />
        </ListItem>
        <ListItem button component={Link} to="/course-management">
          <ListItemIcon sx={{ color: "#4e9fa8" }}>
            <SchoolIcon />
          </ListItemIcon>
          <ListItemText primary="Courses" sx={{ color: "black" }} />
        </ListItem>
        <ListItem button component={Link} to="/user-transactions">
          <ListItemIcon sx={{ color: "#4e9fa8" }}>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Transactions" sx={{ color: "black" }} />
        </ListItem>
        <ListItem button component={Link} to="/send-announcement">
          <ListItemIcon sx={{ color: "#4e9fa8" }}>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Announcement" sx={{ color: "black" }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
