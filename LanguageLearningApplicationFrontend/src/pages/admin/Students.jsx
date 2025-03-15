

import React, { useEffect, useState } from "react";
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
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/student/all-students"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Function to toggle block/unblock status
  const toggleBlockStatus = async (studentId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/block-student/${studentId}`
      );

      // Update UI
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, blocked: response.data.user.blocked }
            : student
        )
      );
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  // Function to open menu
  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  // Function to close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  // Function to delete a student
  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(
        `http://localhost:3000/admin/delete-student/${studentId}`
      );

      // Update UI after deletion
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );

      handleMenuClose();
    } catch (error) {
      console.error("Error deleting student:", error);
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
        <Navbar title="Student Management" />

        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8" }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Student Management
          </Typography>

          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>
                    <strong>Student Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Student Email</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Student Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar
                          src={
                            student.avatar || "https://via.placeholder.com/40"
                          }
                        />
                        <Typography>{student.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>

                    {/* Status Toggle */}
                    {/* <TableCell
                      align="center"
                      onClick={() =>
                        toggleBlockStatus(student._id, student.blocked)
                      }
                      sx={{
                        cursor: "pointer",
                        width: "90px",
                        borderRadius: "5px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: student.blocked === "no" ? "green" : "red",
                        backgroundColor:
                          student.blocked === "no" ? "#d4edda" : "#f8d7da",

                        // Flexbox Fix
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "24px", // Explicit height for better alignment
                        minWidth: "70px",
                        padding: "0 8px", // Reduce padding
                        textTransform: "capitalize", // Ensure consistent text style

                        transition: "0.3s",
                        "&:hover": {
                          backgroundColor:
                            student.blocked === "no" ? "#c3e6cb" : "#f5c6cb",
                        },
                      }}
                    >
                      {student.blocked === "no" ? "Unblocked" : "Blocked"}
                    </TableCell> */}


                    <TableCell
  align="center"
  onClick={() => toggleBlockStatus(student._id, student.blocked)}
  sx={{
    cursor: "pointer",
    width: "90px",
    borderRadius: "5px",
    fontSize: "12px",
    fontWeight: "bold",
    color: student.blocked === "no" ? "green" : "red",
    backgroundColor: student.blocked === "no" ? "#d4edda" : "#f8d7da",
    
    // Ensure full width & height
    display: "flex",  
    alignItems: "center",  
    justifyContent: "center",  
    height: "100%",  
    minHeight: "30px", // Ensure proper vertical alignment
    minWidth: "80px",  

    padding: "0px", // Remove extra padding
    textTransform: "capitalize", 

    transition: "0.3s",
    "&:hover": {
      backgroundColor: student.blocked === "no" ? "#c3e6cb" : "#f5c6cb",
    },
  }}
>
  {student.blocked === "no" ? "Unblocked" : "Blocked"}
</TableCell>


                    {/* Action Menu */}
                    <TableCell align="center">
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, student)}
                      >
                        <BsThreeDotsVertical />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() =>
                            handleDeleteStudent(selectedStudent._id)
                          }
                          style={{ color: "red" }}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
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

export default Students;
