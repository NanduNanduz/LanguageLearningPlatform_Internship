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
  useTheme,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;
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
      await axios.delete(
        `http://localhost:3000/instructor/delete-course/${courseId}`
      );
      setCourseDetails(
        courseDetails.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdate = (courseId) => navigate(`/updateCourse/${courseId}`);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        pt: 4,
      }}
    >
      <CssBaseline />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          px: isMobile ? 2 : 4, // Responsive padding
          pb: 4,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
          }}
        >
          {/* Welcome Section */}
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1 }}
              style={{ color: "#4e9fa8" }}
            >
              WELCOME, {instructor?.name}
            </Typography>
            <Typography variant="h5" color="textSecondary">
              YOUR COURSES
            </Typography>
          </Box>

          {/* Courses Grid */}
          <Grid container spacing={3} justifyContent="center">
            {courseDetails.length > 0 ? (
              courseDetails.map((course) => (
                <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        textAlign={"center"}
                        variant="h6"
                        sx={{ fontWeight: "bold" }}
                        style={{ color: " #4e9fa8" }}
                      >
                        {course.title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center", p: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        // color="primary"
                        component={Link}
                        to={`/coursePage/${course._id}`}
                        sx={{ mx: 0.5 }}
                        style={{ backgroundColor: " rgb(133, 181, 187)" }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUpdate(course._id)}
                        sx={{ mx: 0.5 }}
                        style={{ backgroundColor: " rgb(95, 115, 117)" }}
                      >
                        Update
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(course._id)}
                        sx={{ mx: 0.5 }}
                        style={{ backgroundColor: " rgb(179, 183, 184)" }}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                  No courses found. Create your first course to get started!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/addCourse"
                  sx={{ mt: 2 }}
                >
                  Create New Course
                </Button>
              </Box>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default InstructorHome;
