import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/admin/courseDetails/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!course) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Course Thumbnail */}
      <Card sx={{ display: "flex", marginBottom: "20px" }}>
        <CardMedia
          component="img"
          sx={{ width: 200 }}
          image={course.thumbnail}
          alt={course.title}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {course.title}
          </Typography>
          <Typography variant="body1">
            Instructor: {course.instructorName}
          </Typography>
          <Typography variant="body1">Category: {course.category}</Typography>
          <Typography variant="body1">Status: {course.status}</Typography>
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            {course.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Course Videos */}
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "10px" }}>
        Course Videos
      </Typography>
      <List>
        {course.videos && course.videos.length > 0 ? (
          course.videos.map((video, index) => (
            <ListItem key={video._id}>
              <ListItemText primary={`${index + 1}. ${video.videoTitle}`} />
              <video width="300" height="180" controls>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </ListItem>
          ))
        ) : (
          <Typography>No videos uploaded for this course.</Typography>
        )}
      </List>
    </Box>
  );
};

export default CourseDetails;
