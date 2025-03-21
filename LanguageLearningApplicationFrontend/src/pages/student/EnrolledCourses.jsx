import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Container,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const EnrolledCourses = () => {
  const location = useLocation();
  const student = location.state?.student; // Get student details from state
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/student/enrolledCourse/${student?._id}`
        );
    
        const enrolledData = response.data?.courses || [];
    
        // Extract course IDs and fetch full course details
        const courseIds = enrolledData.map((item) => item.courseId || item._id);
    
        const courseDetailsPromises = courseIds.map((id) =>
          axios.get(`http://localhost:3000/instructor/courseItems/${id}`)
        );
    
        const courseResponses = await Promise.all(courseDetailsPromises);
    
        // Extract the actual course data
        const fullCourses = courseResponses.map((res) => res.data.course);
    
        setEnrolledCourses(fullCourses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (student?._id) {
      fetchEnrolledCourses();
    }    
  }, [student]);

  return (
    <Container sx={{ paddingTop: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Enrolled Courses
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : enrolledCourses.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {enrolledCourses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  minWidth: 250,
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                {/* Course Thumbnail */}
                <Box
                  component="img"
                  src={course.thumbnail}
                  alt={course.title}
                  sx={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />

                <CardContent>
                  {/* Course Title */}
                  <Typography variant="h6">{course.title}</Typography>

                  {/* Course Description (Shortened) */}
                  <Typography variant="body2" color="textSecondary">
                    {course.description.length > 60
                      ? `${course.description.substring(0, 60)}...`
                      : course.description}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                  {/* Go to Course Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/fullCourse/${course._id}`}
                    sx={{ borderRadius: 2, fontSize: "0.8rem", padding: "6px 12px" }}
                  >
                    Go to Course
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="textSecondary" align="center">
          No enrolled courses found.
        </Typography>
      )}
    </Container>
  );
};

export default EnrolledCourses;
