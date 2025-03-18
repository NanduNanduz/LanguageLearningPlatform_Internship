import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, CardMedia, CardContent, Typography, CircularProgress, Alert, Box } from "@mui/material";

const CoursePageStudent = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/instructor/courseItems/${courseId}`);
        setCourse(response.data.course);
      } catch (err) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return <Container sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ textAlign: "center", mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden" }}>
        <CardMedia component="img" height="250" image={course.thumbnail} alt={course.title} />
        <CardContent>
          <Typography variant="h5" fontWeight="bold">{course.title}</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>{course.description}</Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Instructor: {course.instructorName}</Typography>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Typography variant="h6" fontWeight="bold">Introduction</Typography>
        {course.videos.length > 0 ? (
          <Box mt={2}>
            <Typography variant="body1" fontWeight="medium">{course.videos[0].videoTitle}</Typography>
            <video controls width="100%" style={{ marginTop: "10px", borderRadius: "8px" }}>
              <source src={course.videos[0].videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>No videos available for this course.</Alert>
        )}
      </Box>
    </Container>
  );
};

export default CoursePageStudent;
