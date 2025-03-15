import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const InstructorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const instructor = location.state?.user;
  const instructorId = instructor?._id; // Safer access

  const [courseDetails, setCourseDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (!instructorId) {
          throw new Error("Instructor ID is missing");
        }

        const response = await axios.get(
          `http://localhost:3000/instructor/courseDetails/${instructorId}`
        );

        if (!response.data.success || !response.data.courses) {
          throw new Error("No course data available");
        }

        setCourseDetails(response.data.courses);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching course details");
        console.error("Axios Error:", error);
      }
    };

    if (instructor) {
      fetchCourseDetails();
    }
  }, [instructorId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/"); // Redirect to home
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <Button onClick={handleLogout} variant="contained" color="error">
          LOGOUT
        </Button>
        <Button
          onClick={() => navigate("/addCourse", { state: { instructor: instructor } })}
          variant="contained"
          color="primary"
        >
          ADD COURSE
        </Button>
      </div>

      <div className="mt-5 text-center">
        {instructor ? (
          <Card sx={{ maxWidth: 500, margin: "auto", padding: 2 }}>
            <CardContent>
              <Typography variant="h5">Welcome, {instructor.name}</Typography>
              <Typography>Email: {instructor.email}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography color="error">Instructor data not found. Please log in.</Typography>
        )}
      </div>

      {/* Display Course Cards */}
      <div style={{ maxWidth: "900px", margin: "auto", marginTop: "20px" }}>
        <Typography variant="h5" textAlign="center" marginBottom={2}>
          Your Courses
        </Typography>

        {error ? (
          <Typography color="error">{error}</Typography>
        ) : courseDetails.length > 0 ? (
          <Grid container spacing={3}>
            {courseDetails.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{ boxShadow: 3, cursor: "pointer", transition: "0.3s" }}
                  onClick={() => navigate(`/coursePage/${course._id}`)}
                >
                  <CardContent>
                    <Typography variant="h6">{course.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {course.description.substring(0, 50)}...
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No courses found.</Typography>
        )}
      </div>
    </>
  );
};

export default InstructorHome;
