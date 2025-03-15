import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, TextField, Typography, CircularProgress, Box } from "@mui/material";

const ResourcesPage = () => {
  const { courseId } = useParams();
  const [videoInputs, setVideoInputs] = useState([{ title: "", file: null }]);
  const [resourceInputs, setResourceInputs] = useState([{ name: "", file: null }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle video input changes
  const handleVideoChange = (index, field, value) => {
    const updatedVideos = [...videoInputs];
    updatedVideos[index][field] = value;
    setVideoInputs(updatedVideos);
  };

  // Handle resource input changes
  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...resourceInputs];
    updatedResources[index][field] = value;
    setResourceInputs(updatedResources);
  };

  // Add a new video input field
  const addVideoInput = () => {
    setVideoInputs([...videoInputs, { title: "", file: null }]);
  };

  // Add a new resource input field
  const addResourceInput = () => {
    setResourceInputs([...resourceInputs, { name: "", file: null }]);
  };

  // Upload Handler
  const handleUpload = async () => {
    if (!videoInputs.some(v => v.file) && !resourceInputs.some(r => r.file)) {
      setMessage("Please upload at least one video or resource.");
      return;
    }

    const formData = new FormData();
    
    videoInputs.forEach((video, index) => {
      if (video.file) {
        formData.append("videos", video.file);
        formData.append("videoTitle", video.title || `Video ${index + 1}`);
      }
    });

    resourceInputs.forEach((resource, index) => {
      if (resource.file) {
        formData.append("resources", resource.file);
        formData.append("resourceName", resource.name || `Resource ${index + 1}`);
      }
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/instructor/video-resources/${courseId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setMessage("Upload successful!");
        setVideoInputs([{ title: "", file: null }]);
        setResourceInputs([{ name: "", file: null }]);
      } else {
        setMessage("Upload failed: " + response.data.message);
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.message || "Upload failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" marginBottom={2}>Upload Videos & Resources</Typography>

      {/* Video Upload Section */}
      <Typography variant="h6">Upload Videos</Typography>
      {videoInputs.map((video, index) => (
        <Box key={index} marginBottom={2}>
          <TextField
            label={`Title for Video ${index + 1}`}
            fullWidth
            value={video.title}
            onChange={(e) => handleVideoChange(index, "title", e.target.value)}
            margin="normal"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleVideoChange(index, "file", e.target.files[0])}
          />
        </Box>
      ))}
      <Button variant="outlined" onClick={addVideoInput} style={{ marginBottom: "10px" }}>+ Add Another Video</Button>

      {/* Resource Upload Section */}
      <Typography variant="h6" marginTop={3}>Upload Resources</Typography>
      {resourceInputs.map((resource, index) => (
        <Box key={index} marginBottom={2}>
          <TextField
            label={`Name for Resource ${index + 1}`}
            fullWidth
            value={resource.name}
            onChange={(e) => handleResourceChange(index, "name", e.target.value)}
            margin="normal"
          />
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleResourceChange(index, "file", e.target.files[0])}
          />
        </Box>
      ))}
      <Button variant="outlined" onClick={addResourceInput} style={{ marginBottom: "10px" }}>+ Add Another Resource</Button>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpload}
        disabled={loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Upload"}
      </Button>

      {message && <Typography color="error" align="center" marginTop={2}>{message}</Typography>}
    </div>
  );
};

export default ResourcesPage;
