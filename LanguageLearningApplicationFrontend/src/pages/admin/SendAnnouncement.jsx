import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const SendAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = sessionStorage.getItem("logintoken"); // Retrieve the token
    if (!token) {
      setError("You are not logged in. Please log in and try again.");
      return;
    }

    const response = await axios.post(
      "http://localhost:3000/admin/sendAnnouncement",
      { title, message }, // Only send title and message
      {
        headers: { Authorization: `Bearer ${token}` }, // Send the token
      }
    );

    if (response.data.message) {
      setSuccess("Announcement sent successfully!");
      setError("");
      setTitle("");
      setMessage("");
    }
  } catch (error) {
    console.error("Error sending announcement:", error);
    setError("Failed to send announcement. Please try again.");
    setSuccess("");
  }
};

  return (
    <Box sx={{ display: "flex", height: "50vh" }}>
      {/* Sidebar */}
      
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Navbar */}
        <Navbar title="Send Announcement" />

        {/* Send Announcement Form */}
        <Container
          maxWidth="md"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8",marginTop:"10vh" }}
        >
          <Box sx={{ mt: 4 }}>
           
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Send Announcement
              </Button>
            </form>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success" sx={{ mt: 2 }}>
                {success}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default SendAnnouncement;
