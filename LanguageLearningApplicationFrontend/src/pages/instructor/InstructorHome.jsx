import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardActions,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

const InstructorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const instructor = location.state?.user; // Getting instructor details from login

  const [courseDetails, setCourseDetails] = useState([]); // Default empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/instructor/courseDetails/${instructor?._id}`
        );

        console.log("API Response:", response.data); // Debugging

        if (Array.isArray(response.data)) {
          setCourseDetails(response.data);
        } else if (response.data && typeof response.data === "object") {
          setCourseDetails(response.data.courses || []); // Adjust based on API structure
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        setError("Error fetching course details");
        console.error("Error fetching course details:", error);
      }
    };

    if (instructor?._id) {
      fetchCourseDetails();
    }
  }, [instructor]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3000/instructor/delete-course/${courseId}`);
      setCourseDetails(courseDetails.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdate = (courseId) => {
    navigate(`/updateCourse/${courseId}`);
  };

  return (
    <>
      <div style={{ textAlign: "right", padding: "10px" }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
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
          <Card sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
            <CardContent>
              <Typography variant="h5">Welcome, {instructor.name}</Typography>
              <Typography>Email: {instructor.email}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography color="error">
            Instructor data not found. Please log in.
          </Typography>
        )}
      </div>

      {/* Courses Section */}
      <div style={{ marginTop: "20px", padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Courses
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {courseDetails.length > 0 ? (
            courseDetails.map((course) => (
              <Grid item key={course._id} xs={12} sm={6} md={4}>
                <Card sx={{ minWidth: 250 }}>
                  <CardContent>
                    <Typography variant="h6">{course.title}</Typography>
                  </CardContent>
                  <CardActions>
                    {/* Navigate to CoursePage */}
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/coursePage/${course._id}`}
                    >
                      View Course
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleUpdate(course._id)}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography align="center" color="textSecondary">
              No courses found.
            </Typography>
          )}
        </Grid>

        {error && (
          <Typography color="error" align="center" marginTop="10px">
            {error}
          </Typography>
        )}
      </div>
    </>
  );
};

export default InstructorHome;
