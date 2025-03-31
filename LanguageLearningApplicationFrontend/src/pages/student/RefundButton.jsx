import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import axios from "axios";

const RefundButton = ({ userId, courseId }) => {
  const [paymentId, setPaymentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchPaymentId = async () => {
      try {
        const token = sessionStorage.getItem("logintoken");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/student/find/${userId}/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setPaymentId(response.data.payment._id);
        } else {
          setSnackbar({
            open: true,
            message: "Payment record not found",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching payment:", error);
        setSnackbar({
          open: true,
          message: "Failed to load payment information",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentId();
  }, [userId, courseId]);

  const handleRequestRefund = async () => {
    if (!paymentId) return;

    setIsRequesting(true);
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/student/${paymentId}/request-refund`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSnackbar({
        open: true,
        message: "Refund requested successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Refund request failed:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to request refund",
        severity: "error",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {isLoading ? (
        <CircularProgress size={24} />
      ) : paymentId ? (
        <Button
          variant="outlined"
          color="error"
          startIcon={
            isRequesting ? <CircularProgress size={20} /> : <MoneyOffIcon />
          }
          onClick={handleRequestRefund}
          disabled={isRequesting}
        >
          {isRequesting ? "Processing..." : "Request Refund"}
        </Button>
      ) : (
        <Typography color="error">
          Cannot request refund - payment record missing
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default RefundButton;
