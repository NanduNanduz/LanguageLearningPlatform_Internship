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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/instructor/all-Instructors"
      );
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const toggleBlockStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/admin/block-instructor/${id}`, {
        blocked: !status,
      });
      fetchInstructors();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteInstructor = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/instructors/${id}`);
      setInstructors(instructors.filter((inst) => inst._id !== id));
    } catch (error) {
      console.error("Error deleting instructor:", error);
    }
  };

  const handleMenuClick = (event, instructor) => {
    setAnchorEl(event.currentTarget);
    setSelectedInstructor(instructor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInstructor(null);
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
        <Navbar title="Instructor Management" />

        {/* Content Container */}
        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8" }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Instructor Management
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
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Courses Created</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instructors.map((instructor) => (
                  <TableRow key={instructor._id} hover>
                    <TableCell>{instructor.name}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>{instructor.courseCount}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color={instructor.blocked ? "error" : "success"}
                        onClick={() =>
                          toggleBlockStatus(instructor._id, instructor.blocked)
                        }
                        sx={{ textTransform: "capitalize" }}
                      >
                        {instructor.blocked ? "Blocked" : "Unblocked"}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => handleMenuClick(e, instructor)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() =>
                            toggleBlockStatus(
                              selectedInstructor._id,
                              selectedInstructor.blocked
                            )
                          }
                        >
                          {selectedInstructor?.blocked ? "Unblock" : "Block"}
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            deleteInstructor(selectedInstructor._id)
                          }
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

export default Instructors;
