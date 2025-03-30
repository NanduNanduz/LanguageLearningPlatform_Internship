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
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editFormData, setEditFormData] = useState({
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState({
    quizId: "",
    questionId: "",
  });

  const [videoToDelete, setVideoToDelete] = useState(null);
  const [deleteVideoDialogOpen, setDeleteVideoDialogOpen] = useState(false);
  const [videoDeleting, setVideoDeleting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoadingQA, setIsLoadingQA] = useState(false);
  const [qaError, setQAError] = useState(null);
  const navigate = useNavigate();

  // Fetch questions for instructor's course
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQA(true);
      setQAError(null);
      try {
        const token = sessionStorage.getItem("logintoken");
        const response = await axios.get(
          `http://localhost:3000/instructor/${courseId}/questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQAError(error.response?.data?.message || "Failed to load questions");
      } finally {
        setIsLoadingQA(false);
      }
    };

    if (selectedSection === "Q&A") {
      fetchQuestions();
    }
  }, [selectedSection, courseId]);

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
    } else if (section === "students" && students.length === 0) {
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
        // Optional: Show success message
        setError(null);
      } else {
        throw new Error(response.data.message || "Failed to delete video.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error deleting video."
      );
      throw error;
    }
  };

  const handleUpdateVideoTitle = async (videoId) => {
    try {
      await axios.put(
        `http://localhost:3000/instructor/updateVideo/${courseId}/${videoId}`,
        {
          newVideoTitle,
        }
      );
      setCourse({
        ...course,
        videos: course.videos.map((video) =>
          video._id === videoId
            ? { ...video, videoTitle: newVideoTitle }
            : video
        ),
      });
      setEditingVideoId(null);
      setNewVideoTitle("");
    } catch (error) {
      console.error("Error updating video title:", error);
    }
  };

  const fetchEnrolledStudents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/instructor/enrolled-students/${courseId}`
      );
      if (response.data.success) {
        setStudents(response.data.enrolledStudents);
      } else {
        throw new Error("No students found.");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDeleteResource = async (courseId, resourceId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/instructor/course/${courseId}/resource/${resourceId}`
      );

      setCourse((prevCourse) => ({
        ...prevCourse,
        resources: prevCourse.resources.filter(
          (resource) => resource._id !== resourceId
        ),
      }));
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource. Please try again.");
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question._id);
    setEditFormData({
      questionText: question.questionText,
      option1: question.options[0].text,
      option2: question.options[1].text,
      option3: question.options[2].text,
      option4: question.options[3].text,
      correctAnswer: question.correctAnswerIndex.toString(),
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditFormData({
      questionText: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "",
    });
  };

  const handleUpdateQuestion = async (quizId, questionId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/instructor/editQuestion/${quizId}/${questionId}`,
        editFormData
      );

      if (response.data.success) {
        // Update the quizzes state with the edited question
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) => {
            if (quiz._id === quizId) {
              return {
                ...quiz,
                questions: quiz.questions.map((question) => {
                  if (question._id === questionId) {
                    return {
                      ...question,
                      questionText: editFormData.questionText,
                      options: [
                        { text: editFormData.option1 },
                        { text: editFormData.option2 },
                        { text: editFormData.option3 },
                        { text: editFormData.option4 },
                      ],
                      correctAnswerIndex: parseInt(editFormData.correctAnswer),
                    };
                  }
                  return question;
                }),
              };
            }
            return quiz;
          })
        );
        setEditingQuestion(null);
      }
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDeleteQuestion = async (quizId, questionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/instructor/deleteQuestion/${quizId}/${questionId}`
      );

      if (response.data.success) {
        // Update the quizzes state to remove the deleted question
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) => {
            if (quiz._id === quizId) {
              return {
                ...quiz,
                questions: quiz.questions.filter(
                  (question) => question._id !== questionId
                ),
              };
            }
            return quiz;
          })
        );
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleDeleteClick = (quizId, questionId) => {
    setQuestionToDelete({ quizId, questionId });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteQuestion(
      questionToDelete.quizId,
      questionToDelete.questionId
    );
    setDeleteConfirmOpen(false);
  };

  const handleDeleteVideoClick = (videoId) => {
    setVideoToDelete(videoId);
    setDeleteVideoDialogOpen(true);
  };

  const handleConfirmVideoDelete = async () => {
    if (!videoToDelete) return;

    setVideoDeleting(true);
    try {
      await handleDeleteVideo(videoToDelete);
    } finally {
      setVideoDeleting(false);
      setDeleteVideoDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleCancelVideoDelete = () => {
    setDeleteVideoDialogOpen(false);
    setVideoToDelete(null);
  };

  // Post answer as instructor
  const handlePostAnswer = async (questionId) => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.post(
        `http://localhost:3000/instructor/${courseId}/questions/${questionId}/answers`,
        { answer: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions(
        questions.map((q) => (q._id === questionId ? response.data : q))
      );
      setNewAnswer("");
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Error posting answer:", error);
      alert(error.response?.data?.message || "Failed to post answer");
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );

  return (
    <Box
      sx={{ padding: { xs: 2, md: 4 }, maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* Course Header Card */}
      <Card
        sx={{
          boxShadow: 3,
          marginBottom: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderLeft: "5px solid #2c3e50",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#2c3e50" }}
            style={{ color: " #4e9fa8" }}
            textAlign={"center"}
          >
            {course.title}
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              marginBottom: 3,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
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
                fontWeight: "bold",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
              style={{ backgroundColor: " rgb(133, 181, 187)" }}
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
                fontWeight: "bold",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
              style={{ backgroundColor: " rgb(179, 183, 184)" }}
            >
              Add Quiz
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Box
        sx={{
          marginBottom: 4,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        <Stack
          direction="row"
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {["quizzes", "resources", "videos", "students", "Q&A", "reviews"].map(
            (section) => (
              <Button
                key={section}
                variant={selectedSection === section ? "contained" : "text"}
                onClick={() => handleSectionChange(section)}
                sx={{
                  minWidth: 120,
                  fontWeight: "bold",
                  borderRadius: 0,
                  borderBottom:
                    selectedSection === section ? "3px solid #4e9fa8" : "none",
                  color: selectedSection === section ? "white" : "text.primary",
                  backgroundColor:
                    selectedSection === section
                      ? "#2c3e50"
                      : "background.paper",
                  "&:hover": {
                    backgroundColor:
                      selectedSection === section
                        ? "rgb(87, 90, 116)"
                        : " #f5f5f5",
                  },
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            )
          )}
        </Stack>
      </Box>

      {/* Content Sections */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 2,
          padding: 3,
        }}
      >
        {selectedSection === "quizzes" && (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              marginBottom={3}
              sx={{ color: " #2c3e50" }}
              textAlign={"center"}
            >
              COURSE QUIZZES
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
                    "&:before": {
                      display: "none",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      QUIZ {index + 1}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {quiz.questions.map((question, qIndex) => (
                      <Card
                        key={question._id || qIndex}
                        sx={{
                          marginBottom: 3,
                          padding: 2,
                          borderLeft: "4px solid #3f51b5",
                        }}
                      >
                        {editingQuestion === question._id ? (
                          <Box>
                            <TextField
                              fullWidth
                              label="Question Text"
                              name="questionText"
                              value={editFormData.questionText}
                              onChange={handleEditFormChange}
                              sx={{ mb: 2 }}
                            />
                            <Grid container spacing={2}>
                              {["option1", "option2", "option3", "option4"].map(
                                (option, idx) => (
                                  <Grid item xs={12} sm={6} key={option}>
                                    <TextField
                                      fullWidth
                                      label={`Option ${idx + 1}`}
                                      name={option}
                                      value={editFormData[option]}
                                      onChange={handleEditFormChange}
                                    />
                                  </Grid>
                                )
                              )}
                            </Grid>
                            <Typography
                              variant="subtitle1"
                              sx={{ mt: 2, mb: 1 }}
                            >
                              Correct Answer:
                            </Typography>
                            <RadioGroup
                              name="correctAnswer"
                              value={editFormData.correctAnswer}
                              onChange={handleEditFormChange}
                              row
                            >
                              {[0, 1, 2, 3].map((value) => (
                                <FormControlLabel
                                  key={value}
                                  value={value.toString()}
                                  control={<Radio />}
                                  label={`Option ${value + 1}`}
                                />
                              ))}
                            </RadioGroup>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleUpdateQuestion(quiz._id, question._id)
                                }
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          </Box>
                        ) : (
                          <>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                gutterBottom
                              >
                                {qIndex + 1}. {question.questionText}
                              </Typography>
                              <Box display="flex" gap={0.5}>
                                {" "}
                                {/* Changed from IconButton spacing to Box with gap */}
                                <IconButton
                                  onClick={() => handleEditQuestion(question)}
                                  sx={{
                                    backgroundColor: "primary.light",
                                    "&:hover": {
                                      backgroundColor: "primary.main",
                                      color: "white",
                                    },
                                    p: 0.6, // Reduced padding
                                    fontSize: "medium",
                                  }}
                                >
                                  <EditIcon fontSize="inherit" />{" "}
                                  {/* Use inherit to match parent size */}
                                </IconButton>
                                <IconButton
                                  onClick={() =>
                                    handleDeleteClick(quiz._id, question._id)
                                  }
                                  sx={{
                                    backgroundColor: "error.light",
                                    "&:hover": {
                                      backgroundColor: "error.main",
                                      color: "white",
                                    },
                                    p: 0.6, // Reduced padding
                                    fontSize: "medium",
                                  }}
                                >
                                  <DeleteIcon fontSize="inherit" />{" "}
                                  {/* Use inherit to match parent size */}
                                </IconButton>
                              </Box>
                            </Box>
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
                            <Box
                              sx={{
                                backgroundColor: "#e8f5e9",
                                padding: 1.5,
                                borderRadius: 1,
                                marginTop: 1.5,
                              }}
                            >
                              <Typography
                                fontWeight="bold"
                                color="success.dark"
                              >
                                Correct Answer:{" "}
                                {
                                  question.options[question.correctAnswerIndex]
                                    .text
                                }
                              </Typography>
                            </Box>
                          </>
                        )}
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
            <Typography
              variant="h6"
              fontWeight="bold"
              marginBottom={3}
              sx={{ color: "#2c3e50" }}
              textAlign={"center"}
            >
              COURSE RESOURCES
            </Typography>
            {course.resources.length > 0 ? (
              <Grid container spacing={3}>
                {course.resources.map((resource) => (
                  <Grid item xs={12} sm={6} md={4} key={resource._id}>
                    <Card
                      sx={{
                        boxShadow: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
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
                            onClick={() =>
                              window.open(resource.resourceUrl, "_blank")
                            }
                            sx={{ flex: 1 }}
                          >
                            Download
                          </Button>
                          <IconButton
                            onClick={() =>
                              handleDeleteResource(courseId, resource._id)
                            }
                            sx={{
                              backgroundColor: "error.light",
                              "&:hover": {
                                backgroundColor: "error.main",
                                color: "white",
                              },
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
        <Dialog
          open={deleteVideoDialogOpen}
          onClose={handleCancelVideoDelete}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Video Deletion</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this video?
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This action cannot be undone. All video data will be permanently
              removed.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelVideoDelete} disabled={videoDeleting}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmVideoDelete}
              color="error"
              variant="contained"
              disabled={videoDeleting}
              startIcon={
                videoDeleting ? <CircularProgress size={20} /> : <DeleteIcon />
              }
            >
              {videoDeleting ? "Deleting..." : "Delete Video"}
            </Button>
          </DialogActions>
        </Dialog>

        {selectedSection === "videos" && (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              marginBottom={3}
              sx={{ color: " #2c3e50" }}
              textAlign={"center"}
            >
              COURSE VIDEOS
            </Typography>
            <Grid container spacing={3}>
              {course.videos.length > 0 ? (
                course.videos.map((video) => (
                  <Grid item xs={12} sm={6} md={4} key={video._id}>
                    <Card
                      sx={{
                        boxShadow: 3,
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
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
                        <Box
                          sx={{
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            mb: 2,
                          }}
                        >
                          <video
                            src={video.videoUrl}
                            controls
                            style={{
                              width: "100%",
                              display: "block",
                              backgroundColor: "#000",
                            }}
                          />
                        </Box>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
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
                                  backgroundColor: "primary.light",
                                  "&:hover": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleDeleteVideoClick(video._id)
                                }
                                sx={{
                                  backgroundColor: "error.light",
                                  "&:hover": {
                                    backgroundColor: "error.main",
                                    color: "white",
                                  },
                                }}
                                disabled={videoDeleting}
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
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this question?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {selectedSection === "students" && (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              marginBottom={3}
              sx={{ color: " #2c3e50" }}
              textAlign={"center"}
            >
              ENROLLED STUDENTS
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
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() =>
                        navigate(
                          `/student-details/${student.studentId}/course/${courseId}`
                        )
                      }
                    >
                      <Avatar
                        src={student.profilePicture}
                        alt={student.name}
                        sx={{
                          width: 56,
                          height: 56,
                          marginRight: 2,
                          border: "2px solid #3f51b5",
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

        {selectedSection === "Q&A" && (
          <Card sx={{ boxShadow: 3, marginBottom: 3, padding: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                textAlign={"center"}
                sx={{ color: "#2c3e50" }}
              >
                COURSE Q&A
              </Typography>

              {isLoadingQA ? (
                <CircularProgress />
              ) : qaError ? (
                <Typography color="error">{qaError}</Typography>
              ) : questions.length > 0 ? (
                questions.map((question) => (
                  <Card
                    key={question._id}
                    sx={{
                      boxShadow: 2,
                      marginBottom: 3,
                      padding: 2,
                      borderLeft: question.resolved
                        ? "4px solid #4caf50"
                        : "4px solid #1976d2",
                    }}
                  >
                    <CardContent>
                      {/* Question Header */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            src={question.studentId?.profilePicture}
                            alt={question.studentId?.name}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {question.studentId?.name || "Student"}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(question.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Stack>
                        {question.resolved && (
                          <Chip
                            label="Resolved"
                            color="success"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Stack>

                      {/* Question Content */}
                      <Box
                        sx={{
                          mt: 2,
                          mb: 3,
                          p: 2,
                          backgroundColor: " #f9f9f9",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {question.question}
                        </Typography>
                      </Box>

                      {/* Answers Section */}
                      {question.answers.length > 0 && (
                        <Box sx={{ mt: 3 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Answers ({question.answers.length})
                          </Typography>
                          {question.answers.map((answer) => (
                            <Box
                              key={answer._id}
                              sx={{
                                mt: 2,
                                p: 2,
                                backgroundColor: answer.isInstructorAnswer
                                  ? " #e3f2fd"
                                  : " #f5f5f5",
                                borderRadius: 1,
                                borderLeft: answer.isInstructorAnswer
                                  ? "3px solid #1976d2"
                                  : "3px solid #9e9e9e",
                              }}
                            >
                              {" "}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Avatar
                                  src={answer.userId?.profilePicture}
                                  alt={answer.userId?.name}
                                  sx={{ width: 32, height: 32 }}
                                />
                                <Box>
                                  <Typography variant="body1" fontWeight="bold">
                                    {answer.userId?.name}
                                    {answer.isInstructorAnswer && (
                                      <Chip
                                        label="Instructor"
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1 }}
                                      />
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                  >
                                    {new Date(
                                      answer.createdAt
                                    ).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Typography
                                variant="body1"
                                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                              >
                                {answer.answer}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Answer Form */}
                      {selectedQuestion === question._id ? (
                        <Box sx={{ mt: 3 }}>
                          <TextField
                            label="Your answer as instructor"
                            multiline
                            rows={4}
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handlePostAnswer(question._id)}
                              disabled={!newAnswer.trim()}
                            >
                              Post Answer
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => setSelectedQuestion(null)}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Box>
                      ) : (
                        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                          <Button
                            backgroundColor=" rgb(133, 181, 187)"
                            variant="contained"
                            onClick={() => {
                              setSelectedQuestion(question._id);
                              setNewAnswer("");
                            }}
                            startIcon={<EditIcon />}
                          >
                            Answer Question
                          </Button>
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No questions have been asked yet.</Typography>
              )}
            </CardContent>
          </Card>
        )}

        {selectedSection === "reviews" && (
          <>
            <Typography
              variant="h6"
              fontWeight="bold"
              marginBottom={3}
              sx={{ color: "#2c3e50" }}
              textAlign={"center"}
            >
              STUDENT REVIEWS
            </Typography>
            {reviews.length > 0 ? (
              <Grid container spacing={3}>
                {reviews.map((review) => (
                  <Grid item xs={12} key={review._id}>
                    <Card
                      sx={{
                        boxShadow: 2,
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          marginBottom={2}
                        >
                          <Avatar
                            src={review.profilePicture}
                            alt={review.studentName}
                            sx={{ width: 56, height: 56 }}
                          />
                          <Box>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ textTransform: "uppercase" }}
                            >
                              {review.studentName}
                            </Typography>
                            <Rating
                              value={review.rating}
                              readOnly
                              precision={0.5}
                              emptyIcon={
                                <StarIcon
                                  style={{ opacity: 0.55 }}
                                  fontSize="inherit"
                                />
                              }
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: "italic",
                            padding: 2,
                            backgroundColor: "#f8f9fa",
                            borderRadius: 1,
                          }}
                        >
                          "{review.comment}"
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="textSecondary">
                          Posted on:{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
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
