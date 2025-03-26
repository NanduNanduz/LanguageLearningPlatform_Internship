import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardActions,
  Box,
  Container,
  CssBaseline,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240; // Sidebar width

const InstructorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const instructor = location.state?.user;
  const [courseDetails, setCourseDetails] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/instructor/courseDetails/${instructor?._id}`
        );
        setCourseDetails(response.data?.courses || []);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    if (instructor?._id) {
      fetchCourseDetails();
    }
  }, [instructor]);

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3000/instructor/delete-course/${courseId}`);
      setCourseDetails(courseDetails.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdate = (courseId) => navigate(`/updateCourse/${courseId}`);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <CssBaseline />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transition: "margin 0.3s",
          width: "100%", // Ensures full width
          paddingLeft: isMobile ? 0 : `${drawerWidth / 2}px`, // Adjust for sidebar
          paddingRight: isMobile ? 0 : `${drawerWidth / 2}px`, // Balance padding
        }}
      >
        {/* Course Section */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 3,
            maxWidth: "70%", // Adjusted width for centering
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "auto", // Centers horizontally
          }}
        >
          {/* Welcome Message */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Welcome, {instructor?.name}
            </Typography>
          </Box>

          <Typography variant="h4" gutterBottom>
            Your Courses
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {courseDetails.length > 0 ? (
              courseDetails.map((course) => (
                <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      padding: 1,
                      backgroundColor: "#fafafa",
                      textAlign: "center",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {course.title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button size="small" variant="contained" color="primary" component={Link} to={`/coursePage/${course._id}`}>
                        View
                      </Button>
                      <Button size="small" variant="contained" color="secondary" onClick={() => handleUpdate(course._id)}>
                        Update
                      </Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleDelete(course._id)}>
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                No courses found.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default InstructorHome;
