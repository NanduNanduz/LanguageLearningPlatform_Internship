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
} from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchTransactions();
  }, []);

 const fetchTransactions = async () => {
   try {
     const token = sessionStorage.getItem("logintoken");
     console.log("Token:", token); // Debugging

     const { data } = await axios.get("http://localhost:3000/admin/payments", {
       headers: token ? { Authorization: `Bearer ${token}` } : {},
     });

     console.log("API Response:", data); // Debugging
     setTransactions(Array.isArray(data) ? data : []);
   } catch (error) {
     console.error("Error fetching transactions:", error.response || error);
   }
 };


  const handleRefund = async (id) => {
    try {
      await axios.post(
        `/admin/payments/refund/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchTransactions(); // Refresh the transactions list
    } catch (error) {
      console.error("Refund failed:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Sidebar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Navbar title="Transaction Management" />

        {/* Content Container */}
        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8" }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Transaction Management
          </Typography>

          {/* Status Filter Dropdown */}
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

          {/* Transaction Table */}
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
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(transactions) &&
                  transactions
                    .filter(
                      (t) =>
                        statusFilter === "All" ||
                        t.paymentStatus === statusFilter
                    )
                    .map((t) => (
                      <TableRow key={t._id} hover>
                        <TableCell>{t.studentId?.name}</TableCell>
                        <TableCell>{t.courseId?.title}</TableCell>
                        <TableCell>₹{t.amount}</TableCell>
                        <TableCell>{t.paymentStatus}</TableCell>
                        <TableCell align="center">
                          {t.paymentStatus === "Completed" &&
                            !t.refundIssued && (
                              <Button
                                color="error"
                                onClick={() => handleRefund(t._id)}
                              >
                                Refund
                              </Button>
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminTransactions;
