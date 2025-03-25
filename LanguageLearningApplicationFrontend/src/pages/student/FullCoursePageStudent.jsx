import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Divider,
  Rating,
  Box,
  Avatar,
  Chip,
  Paper,
  Tabs,
  Tab,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CloudDownload as CloudDownloadIcon,
  PlayCircle as PlayCircleIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  QuestionAnswer as QuestionAnswerIcon,
  RateReview as RateReviewIcon,
} from "@mui/icons-material";

const StudentCoursePage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user._id;
  const studentName = user.name;
  const profilePicture = user.profilePicture;
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("videos");
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  // State for Q&A
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Fetch questions
  useEffect(() => {
    // In your fetchQuestions function
    const fetchQuestions = async () => {
      try {
        const token = sessionStorage.getItem("logintoken");
        const response = await axios.get(
          `http://localhost:3000/student/${courseId}/questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
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

    if (selectedSection === "review") {
      fetchReviews();
    }
  }, [selectedSection, courseId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const courseResponse = await axios.get(
          `http://localhost:3000/instructor/courseItems/${courseId}`
        );
        setCourse(courseResponse.data.course);

        const quizResponse = await axios.get(
          `http://localhost:3000/instructor/quiz/${courseId}`
        );
        setQuizzes(quizResponse.data.quizzes || []);

        const quizResult = await axios.get(
          `http://localhost:3000/student/quizResults/${userId}/${courseId}`
        );
        setQuizResults(quizResult.data.quizScores);

        const progressResponse = await axios.get(
          `http://localhost:3000/student/${userId}/progress/${courseId}`
        );

        const progressData = progressResponse.data;
        setCompletedVideos(progressData.completedVideos || []);
        setProgressPercentage(progressData.progressPercentage || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && userId) {
      fetchData();
    }
  }, [courseId, userId]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/instructor/quiz/${courseId}`
      );
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleAnswerChange = (quizId, questionIndex, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionIndex]: parseInt(value, 10),
      },
    }));
  };

  const handleSubmitQuiz = async (quizId) => {
    if (!selectedAnswers[quizId]) {
      alert("Please select answers before submitting.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/student/submitquiz", {
        userId,
        quizId,
        selectedAnswers: Object.values(selectedAnswers[quizId]),
      });
      alert("Quiz submitted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Quiz submission failed:", error);
      alert(error.response?.data?.message || "Quiz submission failed.");
    }
    setLoading(false);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (section === "quizzes" && quizzes.length === 0) {
      fetchQuizzes();
    }
  };

  const handleAssignmentUpload = async () => {
    if (!assignmentFile || !assignmentTitle) {
      alert("Please select a file and enter an assignment title.");
      return;
    }

    const formData = new FormData();
    formData.append("assignment", assignmentFile);
    formData.append("title", assignmentTitle);

    try {
      await axios.post(
        `http://localhost:3000/student/upload/${userId}/${courseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Assignment submitted successfully!");
    } catch (error) {
      alert("Failed to submit assignment. Try again.");
    }
  };

  const handleSubmitReview = async () => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userId = user._id;

      const response = await axios.post(
        "http://localhost:3000/student/submit-review",
        {
          studentId: userId,
          courseId: courseId,
          studentName,
          profilePicture,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message) {
        alert("Review submitted successfully!");
        window.location.reload();
        setRating(0);
        setComment("");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      alert(errorMessage);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/instructor/issueCertificate/${userId}/${courseId}`
      );

      if (response.data.success) {
        const certificateUrl = response.data.certificateUrl;
        if (certificateUrl) {
          window.open(certificateUrl, "_blank");
        } else {
          alert("Certificate not found. Please try again later.");
        }
      } else {
        alert(response.data.message || "Failed to fetch certificate.");
      }
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate. Please try again.");
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
        <CircularProgress />
      </Box>
    );

  const sectionIcons = {
    quizzes: <QuizIcon />,
    resources: <DescriptionIcon />,
    videos: <PlayCircleIcon />,
    assignments: <AssignmentIcon />,
    results: <SchoolIcon />,
    "Q&A": <QuestionAnswerIcon />,
    review: <RateReviewIcon />,
  };

  // Post new question
  const handlePostQuestion = async () => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.post(
        `http://localhost:3000/student/${courseId}/questions`,
        { question: newQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions([response.data, ...questions]);
      setNewQuestion("");
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  // Post answer
  const handlePostAnswer = async (questionId) => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.post(
        `http://localhost:3000/student/${courseId}/questions/${questionId}/answers`,
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
    }
  };

  // Upvote answer
  const handleUpvote = async (questionId, answerId) => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.post(
        `http://localhost:3000/student/answers/${answerId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(
        questions.map((q) => (q._id === questionId ? response.data : q))
      );
    } catch (error) {
      console.error("Error upvoting answer:", error);
    }
  };

  // Mark as resolved
  const handleResolve = async (questionId) => {
    try {
      const token = sessionStorage.getItem("logintoken");
      const response = await axios.put(
        `http://localhost:3000/student/questions/${questionId}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(
        questions.map((q) => (q._id === questionId ? response.data : q))
      );
    } catch (error) {
      console.error("Error resolving question:", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "86%",
        margin: "0 auto",
        p: 3,
        backgroundColor: "rgb(156, 183, 186)",
      }}
    >
      {/* Course Header and Thumbnail */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4 }}>
        {/* Text Content on the Left */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {course?.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {course?.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Chip label={`${progressPercentage}% Complete`} color="primary" />
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {/* Course Thumbnail on the Right */}
        {course?.thumbnail && (
          <Box
            sx={{
              flexShrink: 0,
              width: 400,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: "100%", objectFit: "cover" }}
            />
          </Box>
        )}
      </Box>

      {/* Navigation Tabs */}
      <Paper
        elevation={2}
        sx={{ mb: 4, borderRadius: 2, backgroundColor: " #4F959D" }}
      >
        <Tabs
          value={selectedSection}
          onChange={(e, newValue) => handleSectionChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": { minHeight: 64 },
          }}
        >
          {[
            { label: "Videos", value: "videos" },
            { label: "Quizzes", value: "quizzes" },
            { label: "Resources", value: "resources" },
            { label: "Assignments", value: "assignments" },
            { label: "Results", value: "results" },
            { label: "Q&A", value: "Q&A" },
            { label: "Reviews", value: "review" },
          ].map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              icon={sectionIcons[tab.value]}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Content Sections */}
      <Box sx={{ mb: 4 }}>
        {selectedSection === "videos" && (
          <>
            {progressPercentage === 100 && (
              <Paper
                elevation={2}
                sx={{ p: 2, mb: 3, bgcolor: "success.light" }}
              >
                <Typography
                  variant="h6"
                  color="success.dark"
                  textAlign="center"
                >
                  🎉 Congratulations! You've completed all videos. Go to the
                  Results section to download your certificate.
                </Typography>
              </Paper>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                mb: 4,
              }}
            >
              {course?.videos?.map((video) => {
                const isCompleted = completedVideos.includes(video._id);

                const markVideoAsCompleted = async () => {
                  if (isCompleted) return;

                  try {
                    await axios.post(
                      "http://localhost:3000/student/updateProgress",
                      {
                        userId,
                        courseId,
                        videoId: video._id,
                      }
                    );
                    setCompletedVideos((prev) => [...prev, video._id]);
                    window.location.reload();
                  } catch (error) {
                    console.error("Error updating progress:", error);
                  }
                };

                return (
                  <Card
                    key={video._id}
                    elevation={3}
                    sx={{
                      borderRadius: 2,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                      <video
                        src={video.videoUrl}
                        controls
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                        onEnded={markVideoAsCompleted}
                      />
                    </Box>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <PlayCircleIcon color="primary" sx={{ mr: 1 }} />
                        <Typography
                          variant="h6"
                          sx={{ flexGrow: 1, fontSize: "1rem" }}
                        >
                          {video.videoTitle}
                        </Typography>
                        {isCompleted && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Completed"
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </>
        )}

        {selectedSection === "quizzes" && (
          <>
            {quizzes.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">No quizzes available yet</Typography>
              </Paper>
            ) : (
              quizzes.map((quiz, index) => (
                <Paper
                  key={quiz._id || index}
                  elevation={2}
                  sx={{ p: 2, mb: 3, borderRadius: 2 }}
                >
                  <Accordion sx={{ boxShadow: "none" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        variant="h6"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <QuizIcon color="primary" sx={{ mr: 1 }} />
                        Quiz {index + 1}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {quiz.questions.map((question, qIndex) => (
                        <Paper key={qIndex} sx={{ p: 2, mb: 2 }}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {qIndex + 1}. {question.questionText}
                          </Typography>
                          <RadioGroup
                            value={selectedAnswers[quiz._id]?.[qIndex] ?? ""}
                            onChange={(e) =>
                              handleAnswerChange(
                                quiz._id,
                                qIndex,
                                e.target.value
                              )
                            }
                          >
                            {question.options.map((option, oIndex) => (
                              <FormControlLabel
                                key={oIndex}
                                value={String(oIndex)}
                                control={<Radio />}
                                label={option.text}
                                sx={{ mb: 1 }}
                              />
                            ))}
                          </RadioGroup>
                        </Paper>
                      ))}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmitQuiz(quiz._id)}
                        fullWidth
                      >
                        Submit Quiz
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              ))
            )}
          </>
        )}

        {selectedSection === "resources" && (
          <>
            {course?.resources?.length === 0 ? (
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6">No resources available yet</Typography>
              </Paper>
            ) : (
              course.resources.map((resource) => (
                <Paper
                  key={resource._id}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DescriptionIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {resource.resourceName}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<CloudDownloadIcon />}
                    onClick={() => window.open(resource.resourceUrl, "_blank")}
                  >
                    Download
                  </Button>
                </Paper>
              ))
            )}
          </>
        )}

        {selectedSection === "assignments" && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Submit Assignment
            </Typography>
            <TextField
              label="Assignment Title"
              variant="outlined"
              fullWidth
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setAssignmentFile(e.target.files[0])}
                id="assignment-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="assignment-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudDownloadIcon />}
                  sx={{ mr: 2 }}
                >
                  Choose File
                </Button>
              </label>
              {assignmentFile && (
                <Typography variant="body2" display="inline">
                  {assignmentFile.name}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignmentUpload}
              disabled={!assignmentFile || !assignmentTitle}
              fullWidth
              size="large"
            >
              Submit Assignment
            </Button>
          </Paper>
        )}

        {selectedSection === "results" && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quiz Results
            </Typography>
            {quizResults?.length > 0 ? (
              quizResults.map((result, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Quiz {index + 1}:{" "}
                    <span style={{ color: "#4caf50" }}>
                      {result?.score?.toFixed(2)}%
                    </span>
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No quiz results available.</Typography>
            )}

            {progressPercentage === 100 && (
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  🎉 Certificate of Completion
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                  Congratulations on completing the course! Download your
                  certificate below.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownloadCertificate}
                  size="large"
                  startIcon={<SchoolIcon />}
                >
                  Download Certificate
                </Button>
              </Box>
            )}
          </Paper>
        )}

        {selectedSection === "Q&A" && (
          <Card sx={{ boxShadow: 3, marginBottom: 3, padding: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Course Q&A
              </Typography>

              {/* Post New Question */}
              <Stack spacing={2} marginBottom={4}>
                <TextField
                  label="Ask a question"
                  multiline
                  rows={3}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePostQuestion}
                  disabled={!newQuestion.trim()}
                >
                  Post Question
                </Button>
              </Stack>

              {/* Questions List */}
              {questions.length > 0 ? (
                questions.map((question) => (
                  <Card
                    key={question._id}
                    sx={{ boxShadow: 2, marginBottom: 3, padding: 2 }}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6" fontWeight="bold">
                          {question.question}
                        </Typography>
                        {question.resolved && (
                          <Chip label="Resolved" color="success" size="small" />
                        )}
                      </Stack>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Asked by: {question.studentId?.name || "Unknown"}
                      </Typography>

                      {/* Answers */}
                      {question.answers.length > 0 && (
                        <Box sx={{ marginTop: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Answers:
                          </Typography>
                          {question.answers.map((answer) => (
                            <Card
                              key={answer._id}
                              sx={{
                                marginTop: 2,
                                padding: 2,
                                backgroundColor: answer.isInstructorAnswer
                                  ? "#f5f5f5"
                                  : "inherit",
                              }}
                            >
                              <CardContent>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                >
                                  <Typography variant="body1">
                                    {answer.answer}
                                  </Typography>
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      handleUpvote(question._id, answer._id)
                                    }
                                  >
                                    👍 {answer.upvotes?.length || 0}
                                  </Button>
                                </Stack>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {answer.isInstructorAnswer
                                    ? "Instructor"
                                    : "Student"}
                                  : {answer.userId?.name || "Unknown"}
                                </Typography>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      )}

                      {/* Post Answer */}
                      {selectedQuestion === question._id ? (
                        <Stack spacing={2} marginTop={2}>
                          <TextField
                            label="Your answer"
                            multiline
                            rows={3}
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            fullWidth
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
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={2} marginTop={2}>
                          <Button
                            variant="outlined"
                            onClick={() => setSelectedQuestion(question._id)}
                          >
                            Add Answer
                          </Button>
                          {user?.role === "instructor" &&
                            !question.resolved && (
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleResolve(question._id)}
                              >
                                Mark as Resolved
                              </Button>
                            )}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography>No questions yet. Be the first to ask!</Typography>
              )}
            </CardContent>
          </Card>
        )}

        {selectedSection === "review" && (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Submit a Review
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Rating:
              </Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
              />
            </Box>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitReview}
              fullWidth
              size="large"
            >
              Submit Review
            </Button>

            <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
              Course Reviews
            </Typography>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Paper key={review._id} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar
                      src={review.profilePicture}
                      alt={review.studentName}
                    />
                    <Box>
                      <Typography fontWeight="bold">
                        {review.studentName}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 6 }}>
                    {review.comment}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography>No reviews yet.</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default StudentCoursePage;