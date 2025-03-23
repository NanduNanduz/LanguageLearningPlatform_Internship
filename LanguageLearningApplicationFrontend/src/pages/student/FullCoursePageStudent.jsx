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
  Divider,
  Rating,
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
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [message, setMessage]= useState("")
  const [completedVideos, setCompletedVideos] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");
   const [reviews, setReviews] = useState([]);

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
  
        // ✅ Fetch Progress (Percentage)
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
    formData.append("assignment", assignmentFile);  // ✅ File
    formData.append("title", assignmentTitle);      // ✅ Title
  
    try {
      await axios.post(
        `http://localhost:3000/student/upload/${userId}/${courseId}`,
        formData, // ✅ Send FormData directly
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
           rating,
           comment,
         },
         {
           headers: { Authorization: `Bearer ${token}` },
         }
       );

       if (response.data.message) {
         alert("Review submitted successfully!");
         setRating(0);
         setComment("");
       }
     } catch (error) {
       console.error("Error submitting review:", error);
       alert("Failed to submit review. Please try again.");
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
          // ✅ Open the certificate URL in a new tab or download it
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
        <Button
          variant={selectedSection === "Q&A" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("Q&A")}
        >
          Q&A
        </Button>
        <Button
          variant={selectedSection === "review" ? "contained" : "outlined"}
          onClick={() => handleSectionChange("review")}
        >
          Post Review
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

      {selectedSection === "videos" && (
        <>
          {/* ✅ Message at the Top */}
          {progressPercentage === 100 && (
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              textAlign="center"
              marginBottom={2}
            >
              🎉 Congratulations! Go to the Results section to download your
              certificate.
            </Typography>
          )}

          {/* ✅ Video List */}
          {course.videos.map((video) => {
            const isCompleted = completedVideos.includes(video._id); // ✅ Check if video is completed

            const markVideoAsCompleted = async () => {
              if (isCompleted) return; // ✅ Avoid duplicate requests

              try {
                await axios.post(
                  "http://localhost:3000/student/updateProgress",
                  {
                    userId,
                    courseId,
                    videoId: video._id,
                  }
                );

                setCompletedVideos((prev) => [...prev, video._id]); // ✅ Update UI immediately
              } catch (error) {
                console.error("Error updating progress:", error);
              }
            };

            return (
              <Card key={video._id} sx={{ boxShadow: 3, marginBottom: 3 }}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">{video.videoTitle}</Typography>
                    {isCompleted && (
                      <Typography
                        color="green"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        ✅ Completed
                      </Typography>
                    )}
                  </Stack>

                  <video
                    src={video.videoUrl}
                    controls
                    style={{ width: "100%", borderRadius: "10px" }}
                    onEnded={markVideoAsCompleted} // ✅ Mark video as completed when it ends
                  />
                </CardContent>
              </Card>
            );
          })}
        </>
      )}

      {selectedSection === "assignments" && (
        <>
          {/* Submit Assignment Section */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Submit Assignment
          </Typography>

          <TextField
            label="Assignment Title"
            variant="outlined"
            fullWidth
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setAssignmentFile(e.target.files[0])}
            style={{ display: "block", marginBottom: "10px" }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignmentUpload}
            sx={{ marginTop: 2 }}
            disabled={!assignmentFile || !assignmentTitle}
          >
            Submit Assignment
          </Button>
        </>
      )}
      {selectedSection === "results" && (
        <>
          {/* Quiz Results Section */}
          <Typography variant="h5" fontWeight="bold" className="text-center">
            Quiz Results
          </Typography>

          {quizResults?.length > 0 ? (
            quizResults.map((result, index) => (
              <Typography
                key={index}
                variant="h6"
                color="green"
                className="text-center"
              >
                Score: {result?.score?.toFixed(2)} %
              </Typography>
            ))
          ) : (
            <Typography>No quiz results available.</Typography>
          )}

          <Divider sx={{ marginY: 2 }} />

          {/* ✅ Certificate Section (Only if progressPercentage === 100) */}
          {progressPercentage === 100 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🎉 Certificate of Completion
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadCertificate}
                // ✅ Function to download certificate
              >
                Download Certificate
              </Button>
            </div>
          )}
        </>
      )}

      {selectedSection === "review" && (
        <Card sx={{ boxShadow: 3, marginBottom: 3, padding: 2 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              Submit a Review
            </Typography>
            <Stack spacing={2} marginTop={2}>
              <Typography variant="body1">Rating:</Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
              />
              <TextField
                label="Comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitReview}
              >
                Submit Review
              </Button>
            </Stack>

            {/* Display Existing Reviews */}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentCoursePage;
