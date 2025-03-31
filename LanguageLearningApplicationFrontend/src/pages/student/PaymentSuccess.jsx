import React, { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session_id = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/student/verify-payment?session_id=${session_id}`
        );
        alert(response.data.message); // "Payment verified, enrolled successfully!"
        navigate("/studenthome"); // Redirect to the student dashboard
      } catch (error) {
        console.error("Payment verification failed:", error);
        alert("Payment verification failed. Please contact support.");
        navigate("/studenthome");
      }
    };

    if (session_id) {
      verifyPayment();
    }
  }, [session_id, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "20vh",
        textAlign: "center",
        marginTop: "20px",
        padding: "20px",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          color: " #4e9fa8",
          fontWeight: "bold",
          marginBottom: "5px",
        }}
      >
        Payment Successful!
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <CircularProgress style={{ color: " #4e9fa8" }} />
        <Typography variant="h3" component="p" style={{ color: " lightgray" }}>
          Redirecting you to home...
        </Typography>
      </Box>
    </Box>
  );
};

export default PaymentSuccess;
