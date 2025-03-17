import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
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
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useLocation } from "react-router-dom";

const StudentProfile = () => {
  const location = useLocation();
  const student = location.state?.student;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
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
      const response = await axios.get(`http://localhost:3000/user/profile/${student._id}`);
      setProfile(response.data.user);
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
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append("bio", formData.bio);
      data.append("github", formData.github);
      data.append("linkedIn", formData.linkedIn);
      data.append("twitter", formData.twitter);
      data.append("mobile", formData.mobile);
      data.append("qualification", formData.qualification);
      if (profileImage) {
        data.append("profilePicture", profileImage);
      }

      await axios.put(`http://localhost:3000/user/updateUser/${student._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenEdit(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <Typography align="center">Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Card sx={{ maxWidth: 400, margin: "auto", padding: 3, boxShadow: 5, borderRadius: 3, textAlign: "center", background: "linear-gradient(135deg, #f8fafc, #e2e8f0)" }}>
        <CardContent>
          <Avatar src={profile?.profilePicture || "https://via.placeholder.com/150"} alt="Profile" sx={{ width: 100, height: 100, margin: "auto", border: "4px solid #3f51b5", boxShadow: 3 }} />
          <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold", color: "#3f51b5" }}>{profile?.name}</Typography>
          <Typography color="textSecondary">{profile?.email}</Typography>

          <Typography variant="body1" sx={{ mt: 2 }}><strong>Bio:</strong> {profile?.bio || "N/A"}</Typography>
          <Typography variant="body1"><strong>qualification:</strong> {profile?.qualification || "N/A"}</Typography>
          <Typography variant="body1"><strong>Mobile:</strong> {profile?.mobile || "N/A"}</Typography>
          <Typography variant="body1"><strong>GitHub:</strong> {profile?.socialLinks?.github || "N/A"}</Typography>
          <Typography variant="body1"><strong>LinkedIn:</strong> {profile?.socialLinks?.linkedIn || "N/A"}</Typography>
          <Typography variant="body1"><strong>Twitter:</strong> {profile?.socialLinks?.twitter || "N/A"}</Typography>

          <Button variant="contained" color="primary" sx={{ mt: 3, borderRadius: 2, paddingX: 3, boxShadow: 3, transition: "0.3s", "&:hover": { backgroundColor: "#303f9f" } }} onClick={() => setOpenEdit(true)}>Edit Profile</Button>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <Avatar src={profileImage ? URL.createObjectURL(profileImage) : profile?.profilePicture} sx={{ width: 80, height: 80, margin: "auto" }} />
            <input accept="image/*" type="file" onChange={handleImageChange} style={{ display: "none" }} id="upload-photo" />
            <label htmlFor="upload-photo">
              <IconButton component="span" color="primary">
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </div>
          <TextField fullWidth label="Bio" name="bio" value={formData.bio} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="qualification" name="qualification" value={formData.qualification} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="GitHub" name="github" value={formData.github} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="LinkedIn" name="linkedIn" value={formData.linkedIn} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Twitter" name="twitter" value={formData.twitter} onChange={handleChange} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentProfile;
