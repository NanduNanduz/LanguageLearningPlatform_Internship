import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true, // Enable credentials for CORS
});

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications
   socket.on("new-notification", (notification) => {
     setNotifications((prev) => [notification, ...prev]);
   });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.get(
        "http://localhost:3000/student/notifications", // Use the full backend URL
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to fetch notifications. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification._id}
              sx={{ borderBottom: "1px solid #ccc" }}
            >
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Notifications;
