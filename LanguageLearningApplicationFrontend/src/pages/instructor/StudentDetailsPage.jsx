import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Avatar,
  Divider,
  Paper,
  Button,
  Box,
} from "@mui/material";

const StudentDetailsPage = () => {
  const { studentId, courseId } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/student/studentDetails/${studentId}`
        );
        if (response.data) {
          setStudent(response.data);
        } else {
          throw new Error("Student not found.");
        }
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching student data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;
  // Extract only the course details relevant to the instructor's course
  const enrolledCourse = student.enrolledCourses?.find(
    (course) => course.courseId === courseId
  );
  const courseProgress = enrolledCourse?.progressPercentage || 0;
  const quizResult = enrolledCourse?.quizScores?.[0]; // Assuming only one quiz per course
  const assignmentSubmissions = enrolledCourse?.assignments || [];

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#4e9fa8",
          mb: 4,
          textAlign: "center",
        }}
      >
        STUDENT PROGRESS
      </Typography>

      <Card
        sx={{
          boxShadow: 3,
          p: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          {/* Student Profile Section */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm="auto">
              <Avatar
                src={student.profilePicture}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm>
              <Typography variant="h5" fontWeight="bold" color="#4e9fa8">
                {student.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {student.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {student.qualification}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Course Progress Section */}
          <Box mb={4}>
            <Typography variant="h6" color="#4e9fa8" gutterBottom>
              Course Progress
            </Typography>
            <Box
              sx={{
                width: "100%",
                height: 20,
                backgroundColor: "#f0f0f0",
                borderRadius: 10,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${courseProgress}%`,
                  backgroundColor: "#4e9fa8",
                }}
              />
            </Box>
            <Typography variant="body1">
              <strong>Progress:</strong> {courseProgress}%
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Quiz Result Section */}
          <Box mb={4}>
            <Typography variant="h6" color="#4e9fa8" gutterBottom>
              Quiz Result
            </Typography>
            {quizResult ? (
              <Typography variant="body1">
                <strong>Score:</strong> {quizResult.score.toFixed(2)}%
              </Typography>
            ) : (
              <Typography>No quiz attempted yet.</Typography>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Assignment Submissions Section */}
          <Box>
            <Typography variant="h6" color="#4e9fa8" gutterBottom>
              Assignment Submissions
            </Typography>
            {assignmentSubmissions.length > 0 ? (
              <Grid container spacing={2}>
                {assignmentSubmissions.map((assignment, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {assignment.title}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() =>
                            window.open(assignment.fileUrl, "_blank")
                          }
                          size="small"
                        >
                          View Submission
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No assignments submitted yet.</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentDetailsPage;
