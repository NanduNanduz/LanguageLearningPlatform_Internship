import React from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const InstructorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const instructor = location.state?.user; // Getting instructor details from login

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/'); // Redirect to home on logout
  };

  return (
    <>
      <div>
        <Link to={'/'}>
          <Button onClick={handleLogout}>LOGOUT</Button>
        </Link>
      </div>

      <div className="mt-5 text-center">
        {instructor ? (
          <Card sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
            <CardContent>
              <Typography variant="h5">Welcome, {instructor.name}</Typography>
              <Typography>Email: {instructor.email}</Typography>
              <Typography>Courses Created:</Typography>
              <ul>
                {instructor.courseCreated.length > 0 ? (
                  instructor.courseCreated.map((course) => (
                    <li key={course._id}>{course.title}</li>
                  ))
                ) : (
                  <Typography>No courses created yet.</Typography>
                )}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <Typography color="error">Instructor data not found. Please log in.</Typography>
        )}
      </div>
    </>
  );
};

export default InstructorHome;
