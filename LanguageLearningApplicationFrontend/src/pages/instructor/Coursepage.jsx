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
  Box
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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
  const [reviews,setReviews] = useState([]);

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
        setQuizzes(Array.isArray(quizData) ? quizData : [quizData]); // Ensure it's always an array
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
      
      // Update course state to remove the deleted resource
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
      <CircularProgress
        style={{ display: "block", margin: "auto", marginTop: "20px" }}
      />
    );

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Card sx={{ boxShadow: 3, marginBottom: 3, padding: 2 }}>
  <CardContent>
    <Typography variant="h4" fontWeight="bold">
      {course.title}
    </Typography>
    <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 2 }}>
      {course.description}
    </Typography>
    
    {/* Using Stack to align buttons properly */}
    <Stack 
  direction={{ xs: "column", sm: "row" }} 
  spacing={2}
  sx={{ width: "100%", alignItems: { xs: "stretch", sm: "center" } }} // Ensures full width alignment
>
  <Box sx={{ width: "100%" }}> 
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(`/addresources/${courseId}`)}
      sx={{ width: "100%" }} // Full width on small screens
    >
      Add Videos & Resources
    </Button>
  </Box>
  <Box sx={{ width: "100%" }}>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => navigate(`/addquiz/${courseId}`)}
      sx={{ width: "100%" }} // Full width on small screens
    >
      Add Quiz
    </Button>
  </Box>
</Stack>


  </CardContent>
</Card>

<Stack
  direction={{ xs: "column", sm: "row" }} // Column for small screens, row for larger
  spacing={2}
  justifyContent="center"
  alignItems="center"
  flexWrap="wrap" // Ensures wrapping instead of overflowing
  marginBottom={3}
>
  <Button
    variant={selectedSection === "quizzes" ? "contained" : "outlined"}
    onClick={() => handleSectionChange("quizzes")}
    sx={{ width: { xs: "100%", sm: "auto" } }} // Full width on small screens
  >
    Quizzes
  </Button>
  <Button
    variant={selectedSection === "resources" ? "contained" : "outlined"}
    onClick={() => handleSectionChange("resources")}
    sx={{ width: { xs: "100%", sm: "auto" } }}
  >
    Resources
  </Button>
  <Button
    variant={selectedSection === "videos" ? "contained" : "outlined"}
    onClick={() => handleSectionChange("videos")}
    sx={{ width: { xs: "100%", sm: "auto" } }}
  >
    Videos
  </Button>
  <Button
    variant={selectedSection === "students" ? "contained" : "outlined"}
    onClick={() => handleSectionChange("students")}
    sx={{ width: { xs: "100%", sm: "auto" } }}
  >
    Enrolled Students
  </Button>
  <Button
    variant={selectedSection === "Q&A" ? "contained" : "outlined"}
    onClick={() => handleSectionChange("Q&A")}
    sx={{ width: { xs: "100%", sm: "auto" } }}
  >
    Q&A
  </Button>
  <Button
    variant={selectedSection === "reviews" ? "contained" : "outlined"}
    onClick={() => handleSectionChange("reviews")}
    sx={{ width: { xs: "100%", sm: "auto" } }}
  >
    REVIEWS
  </Button>
</Stack>


      {selectedSection === "quizzes" && (
        <>
          <Typography variant="h5" fontWeight="bold" marginBottom={2}>
            Quiz
          </Typography>
          {quizLoading ? (
            <CircularProgress style={{ display: "block", margin: "auto" }} />
          ) : quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <Accordion
                key={quiz._id || index}
                sx={{ boxShadow: 2, marginBottom: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Quiz</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {quiz.questions.map((question, qIndex) => (
                    <Card
                      key={question._id || qIndex}
                      sx={{ marginBottom: 2, padding: 2 }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {qIndex + 1}. {question.questionText}
                      </Typography>
                      <RadioGroup>
                        {question.options.map((option, oIndex) => (
                          <FormControlLabel
                            key={option._id || oIndex}
                            value={option.text}
                            control={<Radio />}
                            label={option.text}
                          />
                        ))}
                      </RadioGroup>
                      <Typography fontWeight="bold" color="green">
                        Correct Answer:{" "}
                        {question.options[question.correctAnswerIndex].text}
                      </Typography>
                    </Card>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography>No quizzes available.</Typography>
          )}
        </>
      )}

      {selectedSection === "resources" && (
        <>
          <Typography variant="h5" fontWeight="bold" marginBottom={2}>
            Resources
          </Typography>
          {course.resources.length > 0 ? (
            course.resources.map((resource) => (
              <Card sx={{ boxShadow: 2, marginBottom: 2 }} key={resource._id}>
                <CardContent>
                  <Typography variant="body1">
                    {resource.resourceName}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloudDownloadIcon />}
                    onClick={() => window.open(resource.resourceUrl, "_blank")}
                  >
                    Open
                  </Button>
                  <IconButton onClick={() => handleDeleteResource(courseId,resource._id)}><DeleteIcon color="error" /></IconButton>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No resources available.</Typography>
          )}
        </>
      )}

{selectedSection === "videos" && (
        <>
          <Typography variant="h5" fontWeight="bold" marginBottom={2}>Course Videos</Typography>
          <Grid container spacing={3}>
            {course.videos.length > 0 ? (
              course.videos.map(video => (
                <Grid item xs={12} sm={6} md={4} key={video._id}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                      {editingVideoId === video._id ? (
                        <TextField
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="h6">{video.videoTitle}</Typography>
                      )}
                      <video src={video.videoUrl} controls style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }} />
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleDeleteVideo(video._id)}><DeleteIcon color="error" /></IconButton>
                        {editingVideoId === video._id ? (
                          <Button variant="contained" color="secondary" onClick={() => handleUpdateVideoTitle(video._id)}>Save</Button>
                        ) : (
                          <IconButton onClick={() => { setEditingVideoId(video._id); setNewVideoTitle(video.videoTitle); }}><EditIcon /></IconButton>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No videos available.</Typography>
            )}
          </Grid>
        </>
      )}
        {selectedSection === "students" && (
        <>
          <Typography variant="h5" fontWeight="bold" marginBottom={2}>Enrolled Students</Typography>
          {students.length > 0 ? (
            <Grid container spacing={2}>
              {students.map((student) => (
                <Grid item xs={12} sm={6} key={student.studentId}>
                  <Card sx={{ boxShadow: 2, display: "flex", alignItems: "center", padding: "10px", cursor:"pointer" }} onClick={() => navigate(`/student-details/${student.studentId}/course/${courseId}`)}>
                    <Avatar
                      src={student.profilePicture}
                      alt={student.name}
                      sx={{ width: 50, height: 50, marginRight: 2 }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{student.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{student.email}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No students enrolled.</Typography>
          )}
        </>
      )}

{selectedSection === "reviews" && (
        <>
          <Typography variant="h5" fontWeight="bold" marginTop={4}>
            Reviews
          </Typography>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card
                key={review._id}
                sx={{ boxShadow: 2, marginBottom: 2, padding: 2 }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} marginBottom={1}>
                    <Avatar src={review.profilePicture} alt={review.studentName} />
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      sx={{ textTransform: 'uppercase' }}
                    >
                      {review.studentName}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    <strong>Rating:</strong> {review.rating}/5
                  </Typography>
                  <Typography variant="body1">
                    <strong>Comment:</strong> {review.comment}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No reviews yet.</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default CoursePage;
