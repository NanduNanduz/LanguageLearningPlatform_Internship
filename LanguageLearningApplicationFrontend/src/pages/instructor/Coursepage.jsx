import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState("videos");

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
        setError(error.response?.data?.message || "Error fetching course data.");
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
  };

  if (loading)
    return (
      <CircularProgress
        style={{ display: "block", margin: "auto", marginTop: "20px" }}
      />
    );
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Card sx={{ boxShadow: 3, marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {course.description}
          </Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="center" marginBottom={3}>
        <Button
          variant={selectedSection === "quizzes" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("quizzes")}
        >
          Quizzes
        </Button>
        <Button
          variant={selectedSection === "resources" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("resources")}
        >
          Resources
        </Button>
        <Button
          variant={selectedSection === "videos" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("videos")}
        >
          Videos
        </Button>
      </Stack>

      {selectedSection === "quizzes" && (
        <>
          <Typography variant="h5" fontWeight="bold" marginBottom={2}>
            Quizzes
          </Typography>
          {quizLoading ? (
            <CircularProgress style={{ display: "block", margin: "auto" }} />
          ) : quizzes.length > 0 ? (
            quizzes.map((quiz, index) => (
              <Accordion key={quiz._id || index} sx={{ boxShadow: 2, marginBottom: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Quiz {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {quiz.questions.map((question, qIndex) => (
                    <Card key={question._id || qIndex} sx={{ marginBottom: 2, padding: 2 }}>
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
                        Correct Answer: {question.options[question.correctAnswerIndex].text}
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
                  <Typography variant="body1">{resource.name}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloudDownloadIcon />}
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    Download
                  </Button>
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
          <Typography variant="h5" fontWeight="bold" marginBottom={2}>
            Course Videos
          </Typography>
          <Grid container spacing={3}>
            {course.videos.length > 0 ? (
              course.videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video._id}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6">{video.videoTitle}</Typography>
                      <video
                        src={video.videoUrl}
                        controls
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayCircleOutlineIcon />}
                        fullWidth
                        onClick={() => window.open(video.videoUrl, "_blank")}
                      >
                        Play Fullscreen
                      </Button>
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
    </div>
  );
};

export default CoursePage;
