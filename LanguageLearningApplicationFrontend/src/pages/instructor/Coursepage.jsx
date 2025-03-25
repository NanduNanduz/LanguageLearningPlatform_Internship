import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  IconButton,
  Avatar,
  Box,
  Divider,
  Chip,
  Rating
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("videos");
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [students, setStudents] = useState([]);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/student/reviews/${courseId}`
        );
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (selectedSection === "reviews") {
      fetchReviews();
    }
  }, [selectedSection, courseId]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/instructor/courseItems/${courseId}`
        );
        if (response.data.success) {
          setCourse(response.data.course);
        } else {
          throw new Error("Course not found.");
        }
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching course data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const fetchQuizzes = async () => {
    setQuizLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/instructor/quiz/${courseId}`
      );

      if (response.data.success) {
        const quizData = response.data.quizzes;
        setQuizzes(Array.isArray(quizData) ? quizData : [quizData]);
      } else {
        throw new Error("No quizzes found.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching quizzes.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (section === "quizzes" && quizzes.length === 0) {
      fetchQuizzes();
    }
    else if (section === "students" && students.length === 0) {
      fetchEnrolledStudents();
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/instructor/delete-video/${courseId}/${videoId}`
      );
      if (response.data.success) {
        setCourse((prevCourse) => ({
          ...prevCourse,
          videos: prevCourse.videos.filter((video) => video._id !== videoId),
        }));
      } else {
        throw new Error("Failed to delete video.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting video.");
    }
  };

  const handleUpdateVideoTitle = async (videoId) => {
    try {
      await axios.put(`http://localhost:3000/instructor/updateVideo/${courseId}/${videoId}`, {
        newVideoTitle,
      });
      setCourse({
        ...course,
        videos: course.videos.map(video =>
          video._id === videoId ? { ...video, videoTitle: newVideoTitle } : video
        )
      });
      setEditingVideoId(null);
      setNewVideoTitle("");
    } catch (error) {
      console.error("Error updating video title:", error);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/instructor/enrolled-students/${courseId}`);
      if (response.data.success) {
        setStudents(response.data.enrolledStudents);
      } else {
        throw new Error("No students found.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDeleteResource = async (courseId, resourceId,) => {
    try {
      const response = await axios.delete(`http://localhost:3000/instructor/course/${courseId}/resource/${resourceId}`);
      
      setCourse(prevCourse => ({
        ...prevCourse,
        resources: prevCourse.resources.filter(resource => resource._id !== resourceId)
      }));
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource. Please try again.");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Course Header Card */}
      <Card sx={{ 
        boxShadow: 3, 
        marginBottom: 4, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderLeft: '5px solid #3f51b5'
      }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#2c3e50' }}>
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ 
            marginBottom: 3,
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            {course.description}
          </Typography>
          
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/addresources/${courseId}`)}
              sx={{ 
                flex: 1,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              Add Videos & Resources
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(`/addquiz/${courseId}`)}
              sx={{ 
                flex: 1,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              Add Quiz
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Box sx={{ 
        marginBottom: 4,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 2
      }}>
        <Stack
          direction="row"
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none'
          }}
        >
          {["quizzes", "resources", "videos", "students", "Q&A", "reviews"].map((section) => (
            <Button
              key={section}
              variant={selectedSection === section ? "contained" : "text"}
              onClick={() => handleSectionChange(section)}
              sx={{
                minWidth: 120,
                fontWeight: 'bold',
                borderRadius: 0,
                borderBottom: selectedSection === section ? '3px solid #3f51b5' : 'none',
                color: selectedSection === section ? 'white' : 'text.primary',
                backgroundColor: selectedSection === section ? '#3f51b5' : 'background.paper',
                '&:hover': {
                  backgroundColor: selectedSection === section ? '#303f9f' : '#f5f5f5'
                }
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Content Sections */}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
        padding: 3
      }}>
        {selectedSection === "quizzes" && (
          <>
            <Typography variant="h5" fontWeight="bold" marginBottom={3} sx={{ color: '#2c3e50' }}>
              Course Quizzes
            </Typography>
            {quizLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={50} />
              </Box>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <Accordion
                  key={quiz._id || index}
                  sx={{ 
                    boxShadow: 2, 
                    marginBottom: 2,
                    '&:before': {
                      display: 'none'
                    }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Quiz {index + 1}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {quiz.questions.map((question, qIndex) => (
                      <Card
                        key={question._id || qIndex}
                        sx={{ 
                          marginBottom: 3, 
                          padding: 2,
                          borderLeft: '4px solid #3f51b5'
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold" gutterBottom>
                          {qIndex + 1}. {question.questionText}
                        </Typography>
                        <RadioGroup sx={{ marginY: 1 }}>
                          {question.options.map((option, oIndex) => (
                            <FormControlLabel
                              key={option._id || oIndex}
                              value={option.text}
                              control={<Radio color="primary" />}
                              label={option.text}
                              sx={{ marginY: 0.5 }}
                            />
                          ))}
                        </RadioGroup>
                        <Box sx={{
                          backgroundColor: '#e8f5e9',
                          padding: 1.5,
                          borderRadius: 1,
                          marginTop: 1.5
                        }}>
                          <Typography fontWeight="bold" color="success.dark">
                            Correct Answer: {question.options[question.correctAnswerIndex].text}
                          </Typography>
                        </Box>
                      </Card>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No quizzes available for this course
                </Typography>
              </Box>
            )}
          </>
        )}

        {selectedSection === "resources" && (
          <>
            <Typography variant="h5" fontWeight="bold" marginBottom={3} sx={{ color: '#2c3e50' }}>
              Course Resources
            </Typography>
            {course.resources.length > 0 ? (
              <Grid container spacing={3}>
                {course.resources.map((resource) => (
                  <Grid item xs={12} sm={6} md={4} key={resource._id}>
                    <Card sx={{ 
                      boxShadow: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <CloudDownloadIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">
                            {resource.resourceName}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} mt={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<CloudDownloadIcon />}
                            onClick={() => window.open(resource.resourceUrl, "_blank")}
                            sx={{ flex: 1 }}
                          >
                            Download
                          </Button>
                          <IconButton 
                            onClick={() => handleDeleteResource(courseId, resource._id)}
                            sx={{ 
                              backgroundColor: 'error.light',
                              '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No resources available for this course
                </Typography>
              </Box>
            )}
          </>
        )}

        {selectedSection === "videos" && (
          <>
            <Typography variant="h5" fontWeight="bold" marginBottom={3} sx={{ color: '#2c3e50' }}>
              Course Videos
            </Typography>
            <Grid container spacing={3}>
              {course.videos.length > 0 ? (
                course.videos.map(video => (
                  <Grid item xs={12} sm={6} md={4} key={video._id}>
                    <Card sx={{ 
                      boxShadow: 3,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}>
                      <CardContent>
                        {editingVideoId === video._id ? (
                          <TextField
                            value={newVideoTitle}
                            onChange={(e) => setNewVideoTitle(e.target.value)}
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        ) : (
                          <Typography variant="h6" gutterBottom>
                            {video.videoTitle}
                          </Typography>
                        )}
                        <Box sx={{ 
                          position: 'relative',
                          borderRadius: 2,
                          overflow: 'hidden',
                          mb: 2
                        }}>
                          <video 
                            src={video.videoUrl} 
                            controls 
                            style={{ 
                              width: "100%", 
                              display: 'block',
                              backgroundColor: '#000'
                            }} 
                          />
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            '&:hover': {
                              opacity: 1
                            }
                          }}>
                            <PlayCircleOutlineIcon sx={{ 
                              fontSize: 60, 
                              color: 'white' 
                            }} />
                          </Box>
                        </Box>
                        <Stack direction="row" spacing={1} justifyContent="space-between">
                          {editingVideoId === video._id ? (
                            <Button 
                              variant="contained" 
                              color="primary" 
                              size="small"
                              onClick={() => handleUpdateVideoTitle(video._id)}
                              sx={{ flex: 1 }}
                            >
                              Save Changes
                            </Button>
                          ) : (
                            <>
                              <IconButton 
                                onClick={() => { 
                                  setEditingVideoId(video._id); 
                                  setNewVideoTitle(video.videoTitle); 
                                }}
                                sx={{
                                  backgroundColor: 'primary.light',
                                  '&:hover': {
                                    backgroundColor: 'primary.main',
                                    color: 'white'
                                  }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteVideo(video._id)}
                                sx={{
                                  backgroundColor: 'error.light',
                                  '&:hover': {
                                    backgroundColor: 'error.main',
                                    color: 'white'
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="textSecondary">
                      No videos available for this course
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}

        {selectedSection === "students" && (
          <>
            <Typography variant="h5" fontWeight="bold" marginBottom={3} sx={{ color: '#2c3e50' }}>
              Enrolled Students
            </Typography>
            {students.length > 0 ? (
              <Grid container spacing={3}>
                {students.map((student) => (
                  <Grid item xs={12} sm={6} key={student.studentId}>
                    <Card 
                      sx={{ 
                        boxShadow: 2, 
                        display: "flex", 
                        alignItems: "center", 
                        padding: "10px",
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: 4
                        }
                      }} 
                      onClick={() => navigate(`/student-details/${student.studentId}/course/${courseId}`)}
                    >
                      <Avatar
                        src={student.profilePicture}
                        alt={student.name}
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          marginRight: 2,
                          border: '2px solid #3f51b5'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {student.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {student.email}
                        </Typography>
                        <Chip 
                          label="View Progress" 
                          size="small" 
                          color="primary" 
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No students enrolled in this course yet
                </Typography>
              </Box>
            )}
          </>
        )}

        {selectedSection === "reviews" && (
          <>
            <Typography variant="h5" fontWeight="bold" marginBottom={3} sx={{ color: '#2c3e50' }}>
              Student Reviews
            </Typography>
            {reviews.length > 0 ? (
              <Grid container spacing={3}>
                {reviews.map((review) => (
                  <Grid item xs={12} key={review._id}>
                    <Card sx={{ 
                      boxShadow: 2,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)'
                      }
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                          <Avatar 
                            src={review.profilePicture} 
                            alt={review.studentName}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box>
                            <Typography 
                              variant="body1" 
                              fontWeight="bold"
                              sx={{ textTransform: 'uppercase' }}
                            >
                              {review.studentName}
                            </Typography>
                            <Rating
                              value={review.rating}
                              readOnly
                              precision={0.5}
                              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body1" sx={{ 
                          fontStyle: 'italic',
                          padding: 2,
                          backgroundColor: '#f8f9fa',
                          borderRadius: 1
                        }}>
                          "{review.comment}"
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="textSecondary">
                          Posted on: {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No reviews yet for this course
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CoursePage;