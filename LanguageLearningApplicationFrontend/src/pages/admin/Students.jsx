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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/all-students`
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const toggleBlockStatus = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/block-student/${
          selectedStudent._id
        }`
      );

      setStudents(
        students.map((student) =>
          student._id === selectedStudent._id
            ? { ...student, blocked: response.data.user.blocked }
            : student
        )
      );
      setOpenBlockDialog(false);
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteStudent = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-student/${
          selectedStudent._id
        }`
      );
      setStudents(
        students.filter((student) => student._id !== selectedStudent._id)
      );
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleBlockAction = (type) => {
    setActionType(type);
    setOpenBlockDialog(true);
    handleMenuClose();
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
                    <strong>Status</strong>
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

                    {/* Status Display */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            student.blocked === "no" ? "#e8f5e9" : "#ffebee",
                          color:
                            student.blocked === "no" ? "#2e7d32" : "#c62828",
                          fontWeight: "medium",
                          textTransform: "capitalize",
                        }}
                      >
                        {student.blocked === "no" ? "Active" : "Blocked"}
                      </Box>
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
                        {selectedStudent?.blocked === "no" ? (
                          <MenuItem onClick={() => handleBlockAction("block")}>
                            Block
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={() => handleBlockAction("unblock")}
                          >
                            Unblock
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            handleMenuClose();
                          }}
                          sx={{ color: "error.main" }}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedStudent?.name}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteStudent}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)}>
        <DialogTitle>
          Confirm {actionType === "block" ? "Block" : "Unblock"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} {selectedStudent?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)}>Cancel</Button>
          <Button
            onClick={toggleBlockStatus}
            color="primary"
            variant="contained"
          >
            {actionType === "block" ? "Block" : "Unblock"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Students;
