import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useLocation, useNavigate } from "react-router-dom";

const AddCourse = () => {
  const location = useLocation();
  const instructor = location.state?.instructor;
  const instructorId = location.state?.instructor._id; // Access instructorId

  if (!instructorId) {
    return <h2>Error: Instructor ID not found!</h2>; // Handle missing ID
  }
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    instructorName: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoTitles, setVideoTitles] = useState([""]); // At least one input for video title
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // Handle video file selection
  const handleVideoChange = (e, index) => {
    const updatedVideos = [...videoFiles];
    updatedVideos[index] = e.target.files[0];
    setVideoFiles(updatedVideos);
  };

  // Handle video title change
  const handleVideoTitleChange = (e, index) => {
    const updatedTitles = [...videoTitles];
    updatedTitles[index] = e.target.value;
    setVideoTitles(updatedTitles);
  };

  // Add new video field
  const addVideoField = () => {
    setVideoTitles([...videoTitles, ""]);
    setVideoFiles([...videoFiles, null]);
  };

  // Remove a video field
  const removeVideoField = (index) => {
    const updatedTitles = [...videoTitles];
    const updatedVideos = [...videoFiles];
    updatedTitles.splice(index, 1);
    updatedVideos.splice(index, 1);
    setVideoTitles(updatedTitles);
    setVideoFiles(updatedVideos);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the thumbnail is uploaded
    if (!thumbnail) {
      setError("Course thumbnail is required.");
      return; // Stop form submission
    }

    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);
      formData.append("category", courseData.category);
      formData.append("instructorName", courseData.instructorName);
      formData.append("thumbnail", thumbnail); // Thumbnail is now required

      videoTitles.forEach((title, index) => {
        if (title) formData.append("videoTitle", title);
        if (videoFiles[index]) formData.append("videos", videoFiles[index]);
      });

      const response = await axios.post(
        `http://localhost:3000/instructor/createCourse/${instructorId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert("Course created successfully!");
        navigate("/instructorHome",{state:{user:instructor}}); // Redirect after success
      }
    } catch (error) {
      setError("Error creating course. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <Card
      sx={{ maxWidth: 600, margin: "auto", mt: 5, padding: 3, boxShadow: 3 }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create a New Course
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Instructor Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructor Name"
                name="instructorName"
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Thumbnail Upload (Optional) */}
            {/* Thumbnail Upload (Required) */}
            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ display: "none" }}
                id="thumbnail-upload"
                required
              />
              <label htmlFor="thumbnail-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Upload Thumbnail (Required)
                </Button>
              </label>
              {thumbnail ? (
                <Typography mt={1}>Selected: {thumbnail.name}</Typography>
              ) : (
                <Typography color="error">* Thumbnail is required</Typography>
              )}
            </Grid>

            {/* Video Uploads (Optional) */}
            <Grid item xs={12}>
              <Typography variant="h6">Course Videos (Optional)</Typography>
              {videoTitles.map((title, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Video Title"
                      value={title}
                      onChange={(e) => handleVideoTitleChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleVideoChange(e, index)}
                      style={{ display: "none" }}
                      id={`video-upload-${index}`}
                    />
                    <label htmlFor={`video-upload-${index}`}>
                      <Button variant="outlined" component="span">
                        Upload Video
                      </Button>
                    </label>
                    {videoFiles[index] && (
                      <Typography variant="body2" mt={1}>
                        {videoFiles[index].name}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    {index > 0 && (
                      <IconButton
                        color="error"
                        onClick={() => removeVideoField(index)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addVideoField}
                sx={{ mt: 1 }}
              >
                Add Another Video
              </Button>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Course
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCourse;
