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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/instructor/all-Instructors`
      );
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const toggleBlockStatus = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/block-instructor/${
          selectedInstructor._id
        }`
      );

      setInstructors(
        instructors.map((instructor) =>
          instructor._id === selectedInstructor._id
            ? {
                ...instructor,
                blocked:
                  response.data.blocked || // First try response.data.blocked
                  (response.data.instructor
                    ? response.data.instructor.blocked // Then try response.data.instructor.blocked
                    : response.data.user
                    ? response.data.user.blocked // Then try response.data.user.blocked
                    : instructor.blocked === "no"
                    ? "yes"
                    : "no"),
              }
            : instructor
        )
      );
      setOpenBlockDialog(false);
    } catch (error) {
      console.error("Error updating block status:", error);
    }
  };

  const deleteInstructor = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/delete-instructor/${
          selectedInstructor._id
        }`
      );
      setInstructors(
        instructors.filter((inst) => inst._id !== selectedInstructor._id)
      );
      setOpenDeleteDialog(false);
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
        <Navbar title="Instructor Management" />

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
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Course Count</strong>
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
                    <TableCell>
                      {instructor.courseCreated
                        ? instructor.courseCreated.length
                        : 0}
                    </TableCell>
                    <TableCell>
                      {instructor.courseCreated &&
                      instructor.courseCreated.length > 0
                        ? instructor.courseCreated.map((course, index) => (
                            <div key={index}>{course.courseTitle}</div>
                          ))
                        : "No courses created"}
                    </TableCell>

                    {/* Status Display */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            instructor.blocked === "no" ? "#e8f5e9" : "#ffebee",
                          color:
                            instructor.blocked === "no" ? "#2e7d32" : "#c62828",
                          fontWeight: "medium",
                          textTransform: "capitalize",
                        }}
                      >
                        {instructor.blocked === "no" ? "Active" : "Blocked"}
                      </Box>
                    </TableCell>

                    {/* Action Menu */}
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
                        {selectedInstructor?.blocked === "no" ? (
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
            Are you sure you want to delete {selectedInstructor?.name}? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={deleteInstructor} color="error" variant="contained">
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
            Are you sure you want to {actionType} {selectedInstructor?.name}?
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

export default Instructors;
