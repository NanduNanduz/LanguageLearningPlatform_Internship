import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  Box,
  useMediaQuery,
} from "@mui/material";

const QuizzPage = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleUpload = async () => {
    if (questions.some((q) => !q.questionText || q.options.some((opt) => !opt))) {
      setMessage("Please complete all question fields.");
      return;
    }

    const formData = new FormData();

    questions.forEach((q, index) => {
      formData.append("questionText", q.questionText);
      formData.append("option1", q.options[0]);
      formData.append("option2", q.options[1]);
      formData.append("option3", q.options[2]);
      formData.append("option4", q.options[3]);
      formData.append("correctAnswer", q.correctAnswer);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/instructor/createQuiz/${courseId}`,
        formData
      );

      if (response.data.success) {
        setMessage("Quiz created successfully!");
        setQuestions([{ questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      } else {
        setMessage("Failed: " + response.data.message);
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#4F959D",
        padding: isMobile ? "10px" : "20px",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "95%" : "50%",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#fff",
          }}
        >
          Create Quiz
        </Typography>

        {questions.map((q, qIndex) => (
          <Box
            key={qIndex}
            sx={{
              marginBottom: "15px",
              background: "rgba(255, 255, 255, 0.1)",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <TextField
              label={`Question ${qIndex + 1}`}
              fullWidth
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              margin="normal"
              variant="outlined"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "4px",
              }}
            />

            {q.options.map((option, optIndex) => (
              <TextField
                key={optIndex}
                label={`Option ${optIndex + 1}`}
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                margin="normal"
                variant="outlined"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "4px",
                }}
              />
            ))}

            <Typography
              variant="subtitle2"
              sx={{ marginTop: "10px", color: "#fff" }}
            >
              Correct Answer:
            </Typography>
            <Select
              value={q.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
            >
              {q.options.map((opt, optIndex) => (
                <MenuItem key={optIndex} value={optIndex}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={addQuestion}
          sx={{
            width: "100%",
            borderRadius: "20px",
            border: "2px solid #fff",
            color: "#fff",
            fontWeight: "bold",
            marginBottom: "10px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          + Add Question
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpload}
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, rgb(94, 78, 111) 0%, #2575FC 100%)",
            borderRadius: "20px",
            padding: "10px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Quiz"}
        </Button>

        {message && (
          <Typography
            sx={{ 
              marginTop: "10px", 
              fontWeight: "bold", 
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.3)",
              padding: "8px",
              borderRadius: "4px"
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default QuizzPage;