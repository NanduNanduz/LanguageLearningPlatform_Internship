import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
  IconButton,
  Box,
  CircularProgress
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useLocation } from "react-router-dom";

const InstructorProfile = () => {
  const location = useLocation();
  const instructor = location.state?.instructor;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    github: "",
    linkedIn: "",
    twitter: "",
    mobile: "",
    qualification: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/profile/${instructor._id}`
      );
      setProfile(response.data.user);
      setPreviewImage(response.data.user.profilePicture || "https://via.placeholder.com/150");

      setFormData({
        bio: response.data.user.bio || "",
        github: response.data.user.socialLinks?.github || "",
        linkedIn: response.data.user.socialLinks?.linkedIn || "",
        twitter: response.data.user.socialLinks?.twitter || "",
        mobile: response.data.user.mobile || "",
        qualification: response.data.user.qualification || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Instant preview
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profileImage) {
        data.append("profilePicture", profileImage);
      }

      await axios.put(
        `http://localhost:3000/user/updateUser/${instructor._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOpenEdit(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <Typography align="center">Loading...</Typography>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      {/* Profile Header */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "250px",
          backgroundImage: "url('/images/bgpic.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <Avatar
          src={previewImage}
          alt="Profile"
          sx={{
            width: 180,
            height: 180,
            position: "absolute",
            bottom: "-60px",
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid white",
            boxShadow: 3,
          }}
        />
      </Box>

      <Typography variant="h5" sx={{ mt: 7, fontWeight: "bold", color: "#3f51b5" }}>
        {profile?.name}
      </Typography>
      <Typography color="textSecondary">{profile?.email}</Typography>

      {/* Profile Details */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ADB2D4", // Light matching background
          paddingTop: 5,
          paddingBottom: 5,
          mt: 3,
        }}
      >
        <Grid container spacing={2} sx={{ maxWidth: 600, margin: "auto" }}>
          {[
            { label: "Bio", value: profile?.bio },
            { label: "Qualification", value: profile?.qualification },
            { label: "Mobile", value: profile?.mobile },
            { label: "GitHub", value: profile?.socialLinks?.github },
            { label: "LinkedIn", value: profile?.socialLinks?.linkedIn },
            { label: "Twitter", value: profile?.socialLinks?.twitter },
          ].map((item, index) => (
            <Grid item xs={6} key={index}>
              <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.label}
                </Typography>
                <Typography>{item.value || "N/A"}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => setOpenEdit(true)}>
        Edit Profile
      </Button>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={previewImage} sx={{ width: 120, height: 120, mb: 1 }} />

            {/* Camera Icon Centered */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="upload-photo"
            />
            <label htmlFor="upload-photo">
              <IconButton color="primary" component="span">
                <PhotoCameraIcon fontSize="large" />
              </IconButton>
            </label>
          </Box>

          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              fullWidth
              margin="dense"
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" disabled={updateLoading}>
            {updateLoading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InstructorProfile;
