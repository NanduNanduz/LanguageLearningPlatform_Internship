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
  CircularProgress,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useLocation, useNavigate } from "react-router-dom";

const StudentProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || location.state?.student?.currentUser;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    bio: "",
    github: "",
    linkedIn: "",
    twitter: "",
    mobile: "",
    qualification: "",
  });
  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [user?._id]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/profile/${user._id}`
      );
      const userData = response.data.user;
      setProfile(userData);
      setFormData({
        bio: userData.bio || "",
        github: userData.socialLinks?.github || "",
        linkedIn: userData.socialLinks?.linkedIn || "",
        twitter: userData.socialLinks?.twitter || "",
        mobile: userData.mobile || "",
        qualification: userData.qualification || "",
      });
      setPreviewImage(
        userData.profilePicture || "https://via.placeholder.com/150"
      );
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
      setPreviewImage(URL.createObjectURL(file)); // Show preview before upload
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profileImage) {
        data.append("profilePicture", profileImage);
      }

      await axios.put(
        `http://localhost:3000/user/updateUser/${user._id}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setOpenEdit(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditOpen = () => {
    setPreviewImage(
      profile?.profilePicture || "https://via.placeholder.com/150"
    );
    setProfileImage(null);
    setOpenEdit(true);
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
          backgroundColor: "#4e9fa8",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <Avatar
          src={profile?.profilePicture || "https://via.placeholder.com/150"}
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

      {/* Name and Email */}
      <Typography
        variant="h5"
        sx={{ mt: 7, fontWeight: "bold", color: " #4e9fa8" }}
      >
        {profile?.name}
      </Typography>
      <Typography color="textSecondary">{profile?.email}</Typography>

      {/* Profile Details in Cards */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "rgb(208, 211, 211)",
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

      <Button
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: "#4F959D",
          "&:hover": { backgroundColor: "#3B7D84" },
        }}
        onClick={handleEditOpen}
      >
        Edit Profile
      </Button>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle sx={{ backgroundColor: "#4F959D", color: "white" }}>
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Avatar
            src={previewImage}
            alt="Profile Preview"
            sx={{ width: 100, height: 100, margin: "auto", mt: 2 }}
          />

          {/* Camera Upload Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="upload-photo"
            />
            <label htmlFor="upload-photo">
              <IconButton color="primary" component="span">
                <PhotoCameraIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </label>
          </Box>

          {/* Editable Fields */}
          {[
            { name: "bio", label: "Bio" },
            { name: "mobile", label: "Mobile" },
            { name: "qualification", label: "Qualification" },
            { name: "github", label: "GitHub" },
            { name: "linkedIn", label: "LinkedIn" },
            { name: "twitter", label: "Twitter" },
          ].map((field, index) => (
            <TextField
              key={index}
              fullWidth
              margin="dense"
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentProfile;
