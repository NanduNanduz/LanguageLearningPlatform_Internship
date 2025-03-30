import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Divider,
  Button,
  Avatar,
  Rating,
} from "@mui/material";
import {
  PlayCircleOutline,
  Star,
  Bookmark,
  Share,
  Lock,
} from "@mui/icons-material";

const CoursePageStudent = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:3000/instructor/courseItems/${courseId}`),
          axios.get(`http://localhost:3000/student/reviews/${courseId}`),
        ]);

        setCourse(courseRes.data.course);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  if (loading)
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Container>
    );

  if (error)
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: 500 }}>
          {error}
        </Alert>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header Section */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
          mb: 4,
          background: "linear-gradient(to right, #f5f7fa, #e4e8f0)",
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <CardMedia
            component="img"
            sx={{
              width: { xs: "100%", md: "40%" },
              maxHeight: 300,
              objectFit: "cover",
            }}
            image={course.thumbnail}
            alt={course.title}
          />
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                {course.description}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Instructor:
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  {course.instructorName}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip
                  icon={<Star color="warning" />}
                  label={`(${reviews.length} reviews)`}
                />
                <Chip
                  label={`${course.videos.length} Lessons`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<PlayCircleOutline />}
                size="large"
                sx={{ borderRadius: 2 }}
              >
                Start Learning
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>

      {/* Main Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
        }}
      >
        {/* Course Videos Section */}
        <Box sx={{ flex: 2 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              p: 3,
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Course Content
            </Typography>

            {course.videos.length > 0 ? (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                    Introduction
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "grey.100",
                      borderRadius: 2,
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      {course.videos[0].videoTitle}
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        height: 0,
                        paddingBottom: "56.25%",
                        backgroundColor: "black",
                      }}
                    >
                      <video
                        controls
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <source
                          src={course.videos[0].videoUrl}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                  All Lessons ({course.videos.length})
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  {course.videos.map((video, index) => (
                    <Card
                      key={index}
                      sx={{
                        borderRadius: 2,
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          height: 0,
                          paddingBottom: "56.25%",
                          backgroundColor: "grey.800",
                        }}
                      >
                        {video.isLocked ? (
                          <PlayCircleOutline
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              fontSize: 48,
                              opacity: 0.8,
                            }}
                          />
                        ) : (
                          <Lock
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "white",
                              fontSize: 48,
                              opacity: 0.8,
                            }}
                          />
                        )}
                      </Box>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {video.videoTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lesson {index + 1} {video.isLocked && "(Locked)"}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </>
            ) : (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                No videos available for this course yet.
              </Alert>
            )}
          </Card>
        </Box>

        {/* Reviews Section */}
        <Box sx={{ flex: 1 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              p: 3,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Student Reviews
            </Typography>

            {reviewsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : reviews.length > 0 ? (
              <Box sx={{ maxHeight: "600px", overflowY: "auto", pr: 1 }}>
                {reviews.map((review, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      pb: 2,
                      borderBottom:
                        index < reviews.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        src={review.studentProfilePic}
                        alt={review.studentName}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography fontWeight="medium">
                          {review.studentName}
                        </Typography>
                        <Rating
                          value={review.rating}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No reviews yet for this course.
              </Alert>
            )}
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default CoursePageStudent;
