import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
} from "@mui/material";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("/api/payments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleRefund = async (id) => {
    try {
      await axios.post(
        `/api/payments/refund/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchTransactions();
    } catch (error) {
      console.error("Refund failed:", error);
    }
  };

  return (
    <div>
      <h2>Transaction Management</h2>
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
        <MenuItem value="Failed">Failed</MenuItem>
        <MenuItem value="Refunded">Refunded</MenuItem>
      </Select>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions
            .filter(
              (t) => statusFilter === "All" || t.paymentStatus === statusFilter
            )
            .map((t) => (
              <TableRow key={t._id}>
                <TableCell>{t.studentId.name}</TableCell>
                <TableCell>{t.courseId.title}</TableCell>
                <TableCell>${t.amount}</TableCell>
                <TableCell>{t.paymentStatus}</TableCell>
                <TableCell>
                  {t.paymentStatus === "Completed" && !t.refundIssued && (
                    <Button color="error" onClick={() => handleRefund(t._id)}>
                      Refund
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTransactions;
