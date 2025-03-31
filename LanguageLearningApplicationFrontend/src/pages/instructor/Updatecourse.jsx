import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Input,
  Card,
  CardMedia,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    thumbnail: "",
  });

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

  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/instructor/courseItems/${courseId}`
        );
        const course = response.data.course;

        if (course) {
          setCourseDetails({
            title: course.title,
            description: course.description,
            price: course.price,
            category: course.category,
            thumbnail: course.thumbnail,
          });
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", courseDetails.title);
      formData.append("description", courseDetails.description);
      formData.append("price", courseDetails.price);
      formData.append("category", courseDetails.category);

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/instructor/editCourse/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("course updated successfully");
      navigate("/instructorHome", { state: { user: user } });
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgb(124, 169, 174)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", marginBottom: "15px" }}
        >
          Update Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={courseDetails.title}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ style: { backgroundColor: "white" } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={courseDetails.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={3}
                InputProps={{ style: { backgroundColor: "white" } }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Price"
                type="number"
                name="price"
                value={courseDetails.price}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ style: { backgroundColor: "white" } }}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl
                fullWidth
                variant="filled"
                sx={{ backgroundColor: "white", borderRadius: "5px" }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={courseDetails.category}
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
              {courseDetails.thumbnail && (
                <Card sx={{ maxWidth: 150, marginBottom: 2 }}>
                  <CardMedia
                    component="img"
                    height="100"
                    image={courseDetails.thumbnail}
                    alt="Course Thumbnail"
                  />
                </Card>
              )}
              <Input type="file" onChange={handleFileChange} fullWidth />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "rgb(85, 123, 159)", color: "white" }}
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Course"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
