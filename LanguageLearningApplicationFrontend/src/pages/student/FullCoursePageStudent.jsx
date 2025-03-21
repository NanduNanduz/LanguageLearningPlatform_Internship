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
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

const StudentCoursePage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user._id;
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("videos");
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const courseResponse = await axios.get(
          `http://localhost:3000/instructor/courseItems/${courseId}`
        );
        setCourse(courseResponse.data.course);

        // Fetch quizzes
        const quizResponse = await axios.get(
          `http://localhost:3000/instructor/quiz/${courseId}`
        );
        setQuizzes(quizResponse.data.quizzes || []);

        const quizResult = await axios.get(
          `http://localhost:3000/student/quizResults/${userId}/${courseId}`
        );
        setQuizResults(quizResult.data.quizScores);
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
        [questionIndex]: parseInt(value, 10), // Convert back to number
      },
    }));
  };

  // Submit quiz
  const handleSubmitQuiz = async (quizId) => {
    if (!selectedAnswers[quizId]) {
      alert("Please select answers before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/student/submitquiz",
        {
          userId,
          quizId,
          selectedAnswers: Object.values(selectedAnswers[quizId]),
        }
      );

      setSubmittedQuiz(quizId);

      alert("Quiz submitted successfully");
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
    if (!assignmentFile) return;

    const formData = new FormData();
    formData.append("file", assignmentFile);
    try {
      await axios.post(
        `http://localhost:3000/student/upload-assignment/${courseId}`,
        formData
      );
      alert("Assignment submitted successfully!");
    } catch (error) {
      console.error("Error uploading assignment:", error);
      alert("Failed to submit assignment. Try again.");
    }
  };

  if (loading)
    return <CircularProgress style={{ display: "block", margin: "auto" }} />;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <Card sx={{ boxShadow: 3, marginBottom: 3, padding: 2 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {course.title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {course.description}
          </Typography>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        marginBottom={3}
      >
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
        <Button
          variant={selectedSection === "assignments" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("assignments")}
        >
          Assignments
        </Button>
        <Button
          variant={selectedSection === "results" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("results")}
        >
          results
        </Button>
      </Stack>

      {selectedSection === "quizzes" &&
        quizzes.map((quiz, index) => {
          return (

            
            <Accordion
              key={quiz._id || index}
              sx={{ boxShadow: 2, marginBottom: 2 }}
            >
            
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Quiz</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {quiz.questions.map((question, qIndex) => (
                  <Card key={qIndex} sx={{ marginBottom: 2, padding: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {qIndex + 1}. {question.questionText}
                    </Typography>
                    <RadioGroup
                      value={selectedAnswers[quiz._id]?.[qIndex] ?? ""}
                      onChange={(e) =>
                        handleAnswerChange(quiz._id, qIndex, e.target.value)
                      }
                    >
                      {question.options.map((option, oIndex) => (
                        <FormControlLabel
                          key={oIndex}
                          value={String(oIndex)}
                          control={<Radio />}
                          label={option.text}
                        />
                      ))}
                    </RadioGroup>
                  </Card>
                ))}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitQuiz(quiz._id)}
                  >
                    Submit Quiz
                  </Button>
            
              </AccordionDetails>
            </Accordion>
          );
        })}

      {selectedSection === "resources" &&
        course.resources.map((resource) => (
          <Card key={resource._id} sx={{ boxShadow: 2, marginBottom: 2 }}>
            <CardContent>
              <Typography variant="body1">{resource.resourceName}</Typography>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CloudDownloadIcon />}
                onClick={() => window.open(resource.resourceUrl, "_blank")}
              >
                Download
              </Button>
            </CardContent>
          </Card>
        ))}

      {selectedSection === "videos" &&
        course.videos.map((video) => (
          <Card key={video._id} sx={{ boxShadow: 3, marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6">{video.videoTitle}</Typography>
              <video
                src={video.videoUrl}
                controls
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </CardContent>
          </Card>
        ))}

      {selectedSection === "assignments" && (
        <>
          <Typography variant="h5" fontWeight="bold">
            Submit Assignment
          </Typography>
          <input
            type="file"
            onChange={(e) => setAssignmentFile(e.target.files[0])}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignmentUpload}
            sx={{ marginTop: 2 }}
          >
            Submit
          </Button>

          <Typography variant="h6" marginTop={3}>
            Your Submitted Assignments
          </Typography>
          {submittedAssignments.length > 0 ? (
            submittedAssignments.map((assignment, index) => (
              <Card key={index} sx={{ boxShadow: 2, marginBottom: 2 }}>
                <CardContent>
                  <Typography>{assignment.fileName}</Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => window.open(assignment.fileUrl, "_blank")}
                  >
                    View Assignment
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No assignments submitted yet.</Typography>
          )}
        </>
      )}
{selectedSection === "results" && (
  <>
    <Typography variant="h5" fontWeight="bold">
      Quiz Results
    </Typography>

    {quizResults?.length > 0 ? (
      quizResults.map((result, index) => (
        <Card key={index} sx={{ boxShadow: 2, marginBottom: 2, padding: 2 }}>
          <CardContent>
            <Typography variant="h6" color="green">
              Score: {result?.score?.toFixed(2)} %
            </Typography>
          </CardContent>
        </Card>
      ))
    ) : (
      <Typography>No quiz results available.</Typography>
    )}
  </>
)}

    </div>
  );
};

export default StudentCoursePage;
