import React, { useEffect, useState } from "react";
import "./CourseCard.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseCard = ({ item }) => {
  const [instructorData, setInstructorData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log(item);

  if (!item) return <div>Error: Course data is missing</div>;

  useEffect(() => {
    const fetchInstructorData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${item.userId}`
        );
        setInstructorData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch instructor data");
      } finally {
        setIsLoading(false);
      }
    };

    if (item.userId) {
      fetchInstructorData();
    }
  }, [item.userId]);

  const handleEnroll = async (e) => {
    e.preventDefault();

    // Get user data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Check if user exists and is a student
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    if (user.role === "instructor") {
      alert("Instructors cannot enroll in courses");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/student/enroll/${item._id}/${user._id}`
      );

      if (response.data.sessionId) {
        window.location.href = response.data.url; // Redirect for payment
      } else {
        alert(response.data.message || "Enrolled Successfully!");
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert(
        error.response?.data?.message || "Failed to enroll. Try again later."
      );
    }
  };

  return (
    <div className="courseCard">
      <img
        src={item.thumbnail || "/images/default-cover.jpg"}
        alt="Course Cover"
      />
      <div className="info">
        <div className="header-row">
          <div className="title-section">
            <h3>{item.title || "Untitled Course"}</h3>
            <p className="instructor">
              {isLoading ? (
                "Loading..."
              ) : error ? (
                <span style={{ color: "red" }}>Error</span>
              ) : (
                item.instructorName ||
                instructorData?.username ||
                "Unknown Instructor"
              )}
            </p>
          </div>
          <div className="price-section">
            <span className="price-label">STARTING AT</span>
            <span className="price">${item.price || "N/A"}</span>
          </div>
        </div>
        <div className="action-buttons">
          <button
            className="view-button"
            onClick={() => navigate(`/coursePageStudent/${item._id}`)}
          >
            View
          </button>
          <button className="enroll-button" onClick={handleEnroll}>
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
