import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import axios from "axios";


const Login = ({onClose}) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [newpassword,setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message,setMessage] = useState("")
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleLogin = async (e) => {
    setMessage("")
    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      return; // Exit the function if fields are empty
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login',formData);
      const { role , blocked } = response.data.user;

      if (blocked === "yes") {
        setMessage("You are blocked from this site.");
        return; // Exit the function if the user is blocked
      }
      sessionStorage.setItem("logintoken", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));


      if (role === "student") {
        navigate("/studentHome", { state: { user: response.data.user } });
      } else if (role === "admin") {
        navigate("/adminDashboard", { state: { user: response.data.user } });
      } else if (role === "instructor") {
        navigate("/instructorHome", { state: { user: response.data.user } });
      }
      alert("login success");
    } catch (error) {
      const errorMessage = error.response?.data?.message
          setMessage(errorMessage)
    }
  
  };

  const handleForgotPassword = () => {
    setForgotOpen(true);
  };

  const handleForgotClose = () => {
    setForgotOpen(false);
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const enteredOtp = otp.join("");
      await axios.post("http://localhost:3000/auth/verifyOtp", {
        email: formData.email,
        otp: enteredOtp,
      });
      alert("OTP verified successfully");
      setOtpOpen(false);
      setResetOpen(true);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleSendMail = async () => {
   
    try {
      const response = await axios.post('http://localhost:3000/auth/reset-password',{email:formData.email} )
      alert("OTP send to your E-mail")
      setForgotOpen(false);
      setOtpOpen(true);
      } catch (error) {
        const errorMessage = error.response?.data?.message
        setMessage(errorMessage)
        }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post("http://localhost:3000/auth/newPass", {
        email: formData.email,
        newPassword:newpassword,
        newConfirmPassword : confirmPassword
      });
      alert("Password reset successful");
      setResetOpen(false);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <Grid container sx={{ minHeight: "450px" }}>
          {/* Left Side: Login Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "white",
            }}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="h5" fontWeight="bold">
                Login
              </Typography>

              <TextField
                label="Enter your email"
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Enter your password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <Link
                component="button"
                variant="body2"
                color="primary"
                sx={{ textAlign: "left" }}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Link>
              {message && (
            <div className="message text-center text-danger">{message}</div>
          )}

              <Button
          onClick={handleLogin}
                variant="contained"
                fullWidth
                sx={{ bgcolor: "purple", color: "white", fontWeight: "bold" }}
              >
                Login
              </Button>
            </Box>
          </Grid>

          {/* Right Side: Image */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                backgroundImage:
                  "url(https://images.pexels.com/photos/7563568/pexels-photo-7563568.jpeg?auto=compress&cs=tinysrgb&w=600)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </Grid>
        </Grid>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={handleForgotClose} maxWidth="md" fullWidth>
        <Grid container sx={{ minHeight: "450px" }}>
          {/* Left Side: Forgot Password Form */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 4,
              backgroundColor: "white",
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "28px",
                color: "#333",
              }}
            >
              Forgot Your Password?
            </DialogTitle>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "#666", mb: 2 }}
            >
              Enter your registered email to reset your password.
            </Typography>

            <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <TextField
                label="Email Address"
                name="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mt: 1, borderRadius: "10px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </DialogContent>
                
            <DialogActions sx={{ justifyContent: "center", pb: 3, flexDirection: "column", width: "100%" }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  background: "linear-gradient(to right, #ff9b44, #fc6076)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  padding: "12px 0",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(to right, #fc6076, #ff9b44)",
                  },
                }}
                onClick={handleSendMail}
              >
                Send mail
              </Button>

              <Button
                fullWidth
                sx={{
                  color: "#B0B0B0",
                  fontWeight: "bold",
                  borderRadius: "25px",
                  padding: "12px 0",
                  textTransform: "none",
                  backgroundColor: "#F5F5F5",
                  mt: 1,
                  "&:hover": {
                    backgroundColor: "#E0E0E0",
                  },
                }}
                onClick={handleForgotClose}
              >
                Back to Sign In
              </Button>
            </DialogActions>
          </Grid>

          {/* Right Side: Forgot Password Image */}
          <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                backgroundImage: "url(/images/forgot_password.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </Grid>
        </Grid>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={otpOpen} onClose={() => setOtpOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", padding: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2983/2983788.png"
              alt="email verification"
              style={{ width: 80, height: 80 }}
            />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Please Verify Account
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", my: 1 }}>
            Enter the six-digit code we sent to your email address.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 2 }}>
            {otp.map((value, index) => (
              <TextField
                key={index}
                type="text"
                variant="outlined"
                inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "20px" } }}
                sx={{
                  width: "3rem",
                  height: "3rem",
                  "& input": { padding: "10px" },
                  "& fieldset": { borderRadius: "10px" },
                }}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "purple",
              color: "white",
              fontWeight: "bold",
              borderRadius: "25px",
              textTransform: "none",
              mt: 2,
            }}
            onClick={handleOtpSubmit}
          >
            Verify & Continue
          </Button>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetOpen} onClose={() => setResetOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", padding: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2983/2983788.png"
              alt="password reset"
              style={{ width: 80, height: 80 }}
            />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Reset Your Password
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", my: 1 }}>
            Enter your new password below.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 2 }}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 1, borderRadius: "10px" }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              sx={{ mt: 1, borderRadius: "10px" }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "purple",
              color: "white",
              fontWeight: "bold",
              borderRadius: "25px",
              textTransform: "none",
              mt: 2,
            }}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Login;