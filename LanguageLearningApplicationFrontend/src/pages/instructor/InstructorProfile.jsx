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
  Divider,
  Paper,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useLocation } from "react-router-dom";

const InstructorProfile = () => {
  const location = useLocation();
  const user = location.state?.user || location.state?.instructor?.currentUser;
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
        `http://localhost:3000/user/profile/${user._id}`
      );
      setProfile(response.data.user);
      setPreviewImage(
        response.data.user.profilePicture || "https://via.placeholder.com/150"
      );

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
      setPreviewImage(URL.createObjectURL(file));
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
        `http://localhost:3000/user/updateUser/${user._id}`,
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
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Profile Header */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          height: 200,
          borderRadius: 2,
          background: "linear-gradient(135deg, #4e9fa8 0%, #2d7e88 100%)",
          mb: 8,
        }}
        mt={4}
      >
        <Avatar
          src={previewImage}
          sx={{
            width: 150,
            height: 150,
            position: "absolute",
            bottom: -75,
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid white",
            boxShadow: 3,
          }}
        />
      </Paper>

      {/* Profile Info */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="#4e9fa8">
          {profile?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {profile?.email}
        </Typography>
      </Box>

      {/* Profile Details */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            {[
              { label: "Bio", value: profile?.bio },
              { label: "Qualification", value: profile?.qualification },
              { label: "Mobile", value: profile?.mobile },
              { label: "GitHub", value: profile?.socialLinks?.github },
              { label: "LinkedIn", value: profile?.socialLinks?.linkedIn },
              { label: "Twitter", value: profile?.socialLinks?.twitter },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="#4e9fa8"
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {item.value || "Not specified"}
                  </Typography>
                </Box>
                {index % 2 === 0 && index < 5 && (
                  <Divider orientation="vertical" flexItem />
                )}
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Box textAlign="center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4e9fa8",
            "&:hover": { backgroundColor: "#3d8b94" },
            px: 4,
            py: 1.5,
          }}
          onClick={() => setOpenEdit(true)}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", color: "#4e9fa8" }}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              src={previewImage}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="upload-photo"
            />
            <label htmlFor="upload-photo">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                sx={{ color: "#4e9fa8", borderColor: "#4e9fa8" }}
              >
                Change Photo
              </Button>
            </label>
          </Box>

          <Grid container spacing={2}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  margin="normal"
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: "#4e9fa8" }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: "#4e9fa8",
              "&:hover": { backgroundColor: "#3d8b94" },
              px: 3,
            }}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InstructorProfile;
