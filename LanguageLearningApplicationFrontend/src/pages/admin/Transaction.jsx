import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [refundRequests, setRefundRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchRefundRequests();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/payments`);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchRefundRequests = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/payments/refund-requests`
      );
      setRefundRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching refund requests:", error);
    }
  };

  const handleRefundAction = (transaction, action) => {
    setSelectedTransaction(transaction);
    if (action === "reject") {
      setOpenDialog(true);
    } else {
      processRefund(transaction._id, "approve");
    }
  };

  const processRefund = async (id, action) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/payments/process-refund/${id}`,
        { action, reason: rejectionReason }
      );
      fetchTransactions();
      fetchRefundRequests();
      setOpenDialog(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Refund processing failed:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Navbar title="Transaction Management" />

        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8" }}
        >
          {/* Refund Requests Section */}
          {refundRequests.length > 0 && (
            <>
              <Typography variant="h6" mb={2}>
                Pending Refund Requests
              </Typography>
              <TableContainer
                component={Paper}
                elevation={3}
                sx={{ mb: 4, borderRadius: 2 }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>
                        <strong>Student</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Course</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Amount</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Request Date</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {refundRequests.map((t) => (
                      <TableRow key={t._id} hover>
                        <TableCell>{t.studentId?.name}</TableCell>
                        <TableCell>{t.courseId?.title}</TableCell>
                        <TableCell>₹{t.amount}</TableCell>
                        <TableCell>
                          {new Date(t.refundRequestDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="success"
                            onClick={() => handleRefundAction(t, "approve")}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleRefundAction(t, "reject")}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {/* All Transactions Section */}
          <Typography variant="h6" mb={2}>
            All Transactions
          </Typography>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Refunded">Refunded</MenuItem>
          </Select>

          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>
                    <strong>Student</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Course</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Refund Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .filter(
                    (t) =>
                      statusFilter === "All" || t.paymentStatus === statusFilter
                  )
                  .map((t) => (
                    <TableRow key={t._id} hover>
                      <TableCell>{t.studentId?.name}</TableCell>
                      <TableCell>{t.courseId?.title}</TableCell>
                      <TableCell>₹{t.amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={t.paymentStatus}
                          color={
                            t.paymentStatus === "Completed"
                              ? "success"
                              : t.paymentStatus === "Refunded"
                              ? "warning"
                              : t.paymentStatus === "Failed"
                              ? "error"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {t.refundStatus !== "Not Requested" && (
                          <Chip
                            label={t.refundStatus}
                            color={
                              t.refundStatus === "Requested"
                                ? "warning"
                                : t.refundStatus === "Approved"
                                ? "success"
                                : t.refundStatus === "Rejected"
                                ? "error"
                                : "default"
                            }
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Rejection Reason Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reject Refund Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this refund request:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            variant="standard"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => processRefund(selectedTransaction._id, "reject")}
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTransactions;
