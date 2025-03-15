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
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Course = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3000/admin/approve-course/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:3000/admin/reject-course/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error rejecting course:", error);
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
        <Navbar title="Course Management" />

        {/* Content Container */}
        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f4f6f8" }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Course Management
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
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Instructor</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
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
                {courses.map((course) => (
                  <TableRow key={course._id} hover>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      {/* {course.instructorId?.name || "Unknown"} */}
                      {course.instructorName}
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.status}</TableCell>
                    <TableCell align="center">
                      {course.status === "Pending" && (
                        <>
                          <Button
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(course._id)}
                          >
                            Approve
                          </Button>
                          <Button
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleReject(course._id)}
                            sx={{ ml: 1 }}
                          >
                            Reject
                          </Button>
                        </>
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

export default Course;
