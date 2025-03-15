import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Input,
  Card,
  CardMedia,
} from "@mui/material";

const UpdateCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    thumbnail: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/instructor/courseItems/${courseId}`
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
        `http://localhost:3000/instructor/editCourse/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/instructorHome",{state:{user:user}});
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20, maxWidth: 600, margin: "auto", marginTop: 40 }}>
      <Typography variant="h5" align="center" gutterBottom>
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
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Category"
              name="category"
              value={courseDetails.category}
              onChange={handleChange}
              fullWidth
              required
            />
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Course
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default UpdateCourse;
