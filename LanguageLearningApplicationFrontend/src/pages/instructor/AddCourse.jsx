import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useLocation, useNavigate } from "react-router-dom";

const AddCourse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user =
    location.state?.user ||
    location.state?.instructor?.currentUser ||
    location.state?.instructor;
  const userId = user?._id;

  console.log("User data in AddCourse:", user); // Debugging log

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    instructorName: user?.username || "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoTitles, setVideoTitles] = useState([""]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Kannada",
    "Odia",
    "Punjabi",
    "Malayalam",
    "Assamese",
    "Maithili",
    "Santali",
    "Kashmiri",
    "Konkani",
    "Sindhi",
    "Dogri",
    "Manipuri",
    "Bodo",
    "Sanskrit",
    "Nepali",
    "English",
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Chinese",
    "Cantonese",
    "Japanese",
    "Korean",
    "Russian",
    "Italian",
    "Turkish",
    "Dutch",
    "Polish",
    "Greek",
    "Hebrew",
    "Arabic",
    "Persian (Farsi)",
    "Thai",
    "Vietnamese",
    "Malay",
    "Swedish",
    "Danish",
    "Finnish",
    "Norwegian",
    "Hungarian",
    "Czech",
    "Slovak",
    "Romanian",
    "Ukrainian",
    "Filipino (Tagalog)",
    "Swahili",
  ];

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleVideoChange = (e, index) => {
    const updatedVideos = [...videoFiles];
    updatedVideos[index] = e.target.files[0];
    setVideoFiles(updatedVideos);
  };

  const handleVideoTitleChange = (e, index) => {
    const updatedTitles = [...videoTitles];
    updatedTitles[index] = e.target.value;
    setVideoTitles(updatedTitles);
  };

  const addVideoField = () => {
    setVideoTitles([...videoTitles, ""]);
    setVideoFiles([...videoFiles, null]);
  };

  const removeVideoField = (index) => {
    const updatedTitles = [...videoTitles];
    const updatedVideos = [...videoFiles];
    updatedTitles.splice(index, 1);
    updatedVideos.splice(index, 1);
    setVideoTitles(updatedTitles);
    setVideoFiles(updatedVideos);
  };

  console.log("User object:", user);
  console.log("Extracted userId:", userId);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!thumbnail) {
      setError("Course thumbnail is required.");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", courseData.price);
      formData.append("category", courseData.category);
      formData.append("instructorName", courseData.instructorName);
      formData.append("thumbnail", thumbnail);
      formData.append("instructorId", userId);

      videoTitles.forEach((title, index) => {
        if (title) formData.append("videoTitles", title);
        if (videoFiles[index]) formData.append("videos", videoFiles[index]);
      });

      const response = await axios.post(
        `http://localhost:3000/instructor/createCourse/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        alert("Course created successfully!");
        navigate("/instructorHome", { state: { user } });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error creating course. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      sx={{
        backgroundColor: "#ADB2D4",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{ width: "100%", maxWidth: 600 }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          Create a New Course
        </Typography>

        {error && (
          <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
              fullWidth
              variant="filled"
              label="Course Title"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
              fullWidth
              variant="filled"
              label="Description"
              name="description"
              value={courseData.description}
              multiline
              rows={3}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
              fullWidth
              variant="filled"
              label="Price (₹)"
              name="price"
              type="number"
              value={courseData.price}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl
              fullWidth
              variant="filled"
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={courseData.category}
                onChange={handleChange}
                required
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ backgroundColor: "white", borderRadius: "5px" }}
              fullWidth
              variant="filled"
              label="Name That Will Be Displayed in the Certificates"
              name="instructorName"
              value={courseData.instructorName}
              onChange={handleChange}
              required
            />
          </Grid>

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
                sx={{ color: "black" }}
              >
                Upload Thumbnail{" "}
                <span style={{ color: "rgb(211, 42, 42)" }}>(Required)</span>
              </Button>
            </label>
            {thumbnail && (
              <Typography mt={1}>Selected: {thumbnail.name}</Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Course Videos (Optional)</Typography>
            {videoTitles.map((title, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    sx={{ backgroundColor: "white", borderRadius: "5px" }}
                    fullWidth
                    variant="filled"
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
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{ color: "black" }}
                    >
                      Upload Video
                    </Button>
                  </label>
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
              sx={{ mt: 1, color: "black" }}
            >
              Add Another Video
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                backgroundColor: "rgb(85, 123, 159)",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "rgb(75, 144, 213)",
                },
              }}
            >
              {submitting ? <CircularProgress size={24} /> : "Create Course"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddCourse;
