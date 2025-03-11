import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
} from "@mui/material";

const Signup = ({ onClose }) => {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setOpenFormModal(true);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <>
      {/* Role Selection Dialog */}
      <Dialog open={!openFormModal} onClose={onClose} maxWidth="md" fullWidth>
        <Grid container>
          {/* Left Side - Motivational Text */}
          <Grid
            item
            xs={5}
            sx={{
              backgroundColor: "#14213D",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
             Learning is a process ,not an event.
           Let's Make it Happen Together!
            </Typography>
            <Typography variant="body1">Join us and start your journey today.</Typography>
          </Grid>

          {/* Right Side - Role Selection */}
          <Grid item xs={7} sx={{ padding: 4 }}>
            <DialogTitle textAlign="center" fontSize={22} fontWeight="bold">
              Join as a Student or Instructor
            </DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="center" gap={2} mt={2}>
                {/* Student Selection */}
                <Paper
                  onClick={() => handleRoleSelect("student")}
                  sx={{
                    width: 230,
                    padding: 3,
                    cursor: "pointer",
                    border: role === "student" ? "2px solid #FCA311" : "1px solid #ccc",
                    borderRadius: 2,
                    "&:hover": { border: "2px solid #FCA311" },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">🎓 I'm a Student</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Looking to learn and enroll in courses.
                  </Typography>
                </Paper>

                {/* Instructor Selection */}
                <Paper
                  onClick={() => handleRoleSelect("instructor")}
                  sx={{
                    width: 230,
                    padding: 3,
                    cursor: "pointer",
                    border: role === "instructor" ? "2px solid #FCA311" : "1px solid #ccc",
                    borderRadius: 2,
                    "&:hover": { border: "2px solid #FCA311" },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">📚 I'm an Instructor</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Looking to teach and share knowledge.
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Button onClick={onClose} color="error" variant="contained">
                Close
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>

      {/* Signup Form Dialog */}
      <Dialog open={openFormModal} onClose={onClose} maxWidth="md" fullWidth>
        <Grid container>
          {/* Left Side - Motivational Text */}
          <Grid
            item
            xs={5}
            sx={{
              backgroundColor: "#14213D",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome {role === "student" ? "Student" : "Instructor"}!
            </Typography>
            <Typography variant="body1">Fill in your details to continue.</Typography>
          </Grid>

          {/* Right Side - Form */}
          <Grid item xs={7} sx={{ padding: 4 }}>
            <DialogTitle textAlign="center" fontSize={22} fontWeight="bold">
              {role === "student" ? "Student Signup" : "Instructor Signup"}
            </DialogTitle>
            <DialogContent>
              <TextField label="Name" name="name" fullWidth margin="dense" onChange={handleChange} />
              <TextField label="Email" name="email" type="email" fullWidth margin="dense" onChange={handleChange} />
              <TextField label="Password" name="password" type="password" fullWidth margin="dense" onChange={handleChange} />
              <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth margin="dense" onChange={handleChange} />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button variant="contained" sx={{ backgroundColor: "#FCA311", color: "#14213D" }}>
                Create Account
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default Signup;