import React, { useState } from "react";
import axios from "axios";
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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const Signup = ({ onClose }) => {
  const navigate = useNavigate();
  const [openFormModal, setOpenFormModal] = useState(false);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: role,
  });

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData((prevData) => ({ ...prevData, role: selectedRole }));
    setOpenFormModal(true);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/auth/register", formData);
      alert("Signup Success");
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <>
      {/* Role Selection Dialog */}
      <Dialog open={!openFormModal} maxWidth="md" fullWidth>
        <Grid container>
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
              Learning is a process, not an event. Let's Make it Happen Together!
            </Typography>
            <Typography variant="body1">Join us and start your journey today.</Typography>
          </Grid>

          <Grid item xs={7} sx={{ padding: 4, position: "relative" }}>
            <DialogTitle textAlign="center" fontSize={22} fontWeight="bold">
              Join as a Student or Instructor
            </DialogTitle>
            {/* Close Button for Role Selection Dialog */}
            <IconButton
              aria-label="close"
              onClick={() => navigate("/")}
              sx={{ position: "absolute", right: 10, top: 10 }}
            >
              <CloseIcon />
            </IconButton>

            <DialogContent>
              <Box display="flex" justifyContent="center" gap={2} mt={2}>
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
                  <Typography variant="h6" fontWeight="bold">
                    🎓 I'm a Student
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Looking to learn and enroll in courses.
                  </Typography>
                </Paper>

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
                  <Typography variant="h6" fontWeight="bold">
                    📚 I'm an Instructor
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Looking to teach and share knowledge.
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
              <Typography variant="body2" sx={{ cursor: "pointer", color: "rgb(41, 39, 35)" }}>
                Already have an account?{" "}
                <span
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </Typography>
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>

      {/* Signup Form Dialog */}
      <Dialog open={openFormModal} maxWidth="md" fullWidth>
        <Grid container>
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

          <Grid item xs={7} sx={{ padding: 4 }}>
            <DialogTitle textAlign="center" fontSize={22} fontWeight="bold">
              {role === "student" ? "Student Signup" : "Instructor Signup"}
            </DialogTitle>

            <DialogContent>
              <TextField required label="Name" name="name" fullWidth margin="dense" onChange={handleChange} />
              <TextField required label="Email" name="email" type="email" fullWidth margin="dense" onChange={handleChange} />
              <TextField required label="Password" name="password" type="password" fullWidth margin="dense" onChange={handleChange} />
              <TextField required label="Confirm Password" name="confirmPassword" type="password" fullWidth margin="dense" onChange={handleChange} />

              {/* Error Message */}
              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                  {errorMessage}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => navigate("/")}>Cancel</Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#FCA311", color: "#14213D" }}
                onClick={handleSubmit}
              >
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
