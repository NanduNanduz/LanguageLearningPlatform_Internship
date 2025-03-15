import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Typography, CircularProgress, Box, Select, MenuItem } from "@mui/material";

const QuizzPage = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Question Text Change
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].questionText = value;
    setQuestions(updatedQuestions);
  };

  // Handle Option Change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle Correct Answer Selection
  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  // Add a new question field
  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  // Upload Quiz
  const handleUpload = async () => {
    if (questions.some(q => !q.questionText || q.options.some(opt => !opt))) {
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" marginBottom={2}>Create Quiz</Typography>

      {questions.map((q, qIndex) => (
        <Box key={qIndex} marginBottom={3} padding={2} border="1px solid #ddd" borderRadius="8px">
          <TextField
            label={`Question ${qIndex + 1}`}
            fullWidth
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            margin="normal"
          />

          {q.options.map((option, optIndex) => (
            <TextField
              key={optIndex}
              label={`Option ${optIndex + 1}`}
              fullWidth
              value={option}
              onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
              margin="normal"
            />
          ))}

          <Typography variant="subtitle1" marginTop={1}>Correct Answer:</Typography>
          <Select
            value={q.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
            fullWidth
          >
            {q.options.map((opt, optIndex) => (
              <MenuItem key={optIndex} value={optIndex}>{opt}</MenuItem>
            ))}
          </Select>
        </Box>
      ))}

      <Button variant="outlined" onClick={addQuestion} style={{ marginBottom: "10px" }}>
        + Add Another Question
      </Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpload}
        disabled={loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Quiz"}
      </Button>

      {message && <Typography color="error" align="center" marginTop={2}>{message}</Typography>}
    </div>
  );
};

export default QuizzPage;
