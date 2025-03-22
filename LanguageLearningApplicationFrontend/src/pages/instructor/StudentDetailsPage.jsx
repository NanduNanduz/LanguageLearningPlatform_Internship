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
      <CircularProgress
        style={{ display: "block", margin: "auto", marginTop: "20px" }}
      />
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
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      {/* Unified Card */}
      <Card sx={{ boxShadow: 3, padding: 3 }}>
        <CardContent>
          {/* Student Profile Section */}
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={student.profilePicture}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h4" fontWeight="bold">
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

          <Divider sx={{ marginY: 3 }} />

          {/* Course Progress */}
          <Typography variant="h5">Course Progress</Typography>
          <Typography variant="body1">
            <strong>Progress:</strong> {courseProgress}%
          </Typography>

          <Divider sx={{ marginY: 3 }} />

          {/* Quiz Result (Single Text) */}
          <Typography variant="h5">Quiz Result</Typography>
          {quizResult ? (
            <Typography variant="body1">
              <strong>Score:</strong> {quizResult.score.toFixed(2)}%
            </Typography>
          ) : (
            <Typography>No quiz attempted yet.</Typography>
          )}

          <Divider sx={{ marginY: 3 }} />

          {/* Assignment Submissions */}
          <Typography variant="h5">Assignment Submissions</Typography>
          {assignmentSubmissions.length > 0 ? (
            assignmentSubmissions.map((assignment, index) => (
              <Paper key={index} sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="body1">
                  <strong>{assignment.title}: </strong>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => window.open(assignment.fileUrl, "_blank")}
                  >
                    Open
                  </Button>
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No assignments submitted yet.</Typography>
          )}

          <Divider sx={{ marginY: 3 }} />

          {/* Social Links */}
          <Typography variant="h5">Social Links</Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="body1">
                <a
                  href={student.socialLinks?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                <a
                  href={student.socialLinks?.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                <a
                  href={student.socialLinks?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsPage;
