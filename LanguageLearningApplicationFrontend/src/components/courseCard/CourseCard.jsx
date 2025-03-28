// import React from "react";
// import "./CourseCard.scss";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest.js";

// const CourseCard = ({ item }) => {
//   if (!item) return <div>Error: Gig data is missing</div>;

//   console.log("Item:", item);
//   const { isLoading, error, data } = useQuery({
//     queryKey: [item.userId],
//     queryFn: () =>
//       newRequest.get(`/users/${item.userId}`).then((res) => res.data),
//   });

//   return (
//     <Link to={`/gig/${item._id}`} className="link">
//       <div className="gigCard">
//         <img src={item.cover || "/images/default-cover.jpg"} alt="Gig Cover" />
//         <div className="info">
//           {isLoading ? (
//             "Loading..."
//           ) : error ? (
//             <span style={{ color: "red" }}>Error: {error.message}</span>
//           ) : (
//             <div className="user">
//               <img src={data?.img || "/images/noavatar.jpg"} alt="User Avatar" />
//               <span>{data?.username || "Unknown User"}</span>
//             </div>
//           )}
//           <p>{item.desc || "No description available"}</p>
//           <div className="star">
//             <img src="/images/star.png" alt="Rating" />
//             <span>
//               {item.starNumber > 0
//                 ? Math.round(item.totalStars / item.starNumber)
//                 : "No ratings"}
//             </span>
//           </div>
//         </div>
//         <hr />
//         <div className="details">
//           <img src="/images/heart.png" alt="Like" />
//           <div className="price">
//             <span>STARTING AT</span>
//             <h2>${item.price || "N/A"}</h2>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default CourseCard;

// import React, { useEffect, useState } from "react";
// import "./CourseCard.scss";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const CourseCard = ({ item }) => {
//   const [instructorData, setInstructorData] = useState(null); // Renamed to instructorData for clarity
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   if (!item) return <div>Error: Course data is missing</div>;

//   console.log("Item:", item);

//   // Fetch instructor data using axios
//   useEffect(() => {
//     const fetchInstructorData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(`http://localhost:3000/users/${item.userId}`); // Correct endpoint for fetching user data
//         setInstructorData(response.data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch instructor data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (item.userId) {
//       fetchInstructorData();
//     }
//   }, [item.userId]);

//   return (
//     <Link to={`/course/${item._id}`} className="link">
//       <div className="courseCard">
//         {/* Course Thumbnail */}
//         <img src={item.thumbnail || "/images/default-cover.jpg"} alt="Course Cover" />
//         <div className="info">
//           {isLoading ? (
//             "Loading..."
//           ) : error ? (
//             <span style={{ color: "red" }}>Error: {error}</span>
//           ) : (
//             <div className="user">
//               {/* Instructor Avatar */}
//               <img src={item.profilePicture || "/images/noavatar.jpg"} alt="Instructor Avatar" />
//               {/* Instructor Name */}
//               <span>{item.instructorName || "Unknown Instructor"}</span>
//             </div>
//           )}
//           {/* Course Description */}
//           <p>{item.description || "No description available"}</p>
//         </div>
//         <hr />
//         <div className="details">
//           {/* Like Button */}
//           <img src="/images/heart.png" alt="Like" />
//           {/* Course Price */}
//           <div className="price">
//             <span>STARTING AT</span>
//             <h2>{item.price || "N/A"}</h2>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default CourseCard;

// CourseCard.jsx
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
        const response = await axios.get(`http://localhost:3000/users/${item.userId}`);
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


  // const handleEnroll = async (e) => {
  //   e.preventDefault();
    
  //   // MAJOR CHANGE 1: Get student data from sessionStorage like in Studenthome
  //   const student = JSON.parse(sessionStorage.getItem("user"));
    
  //   if (!student || !student._id) {
  //     // MAJOR CHANGE 2: Navigate to login with return path like in Studenthome
  //     navigate("/login", { state: { from: window.location.pathname } });
  //     return;
  //   }

  //   try {
  //     // MAJOR CHANGE 3: Use the same enrollment API endpoint as Studenthome
  //     const response = await axios.post(
  //       `http://localhost:3000/student/enroll/${item._id}/${student._id}`
  //     );

  //     // MAJOR CHANGE 4: Handle payment redirect like in Studenthome
  //     if (response.data.sessionId) {
  //       window.location.href = response.data.url; // Redirect for payment
  //     } else {
  //       alert(response.data.message || "Enrolled Successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Enrollment failed:", error);
  //     alert(error.response?.data?.message || "Failed to enroll. Try again later.");
  //   }
  // };

  const handleEnroll = async (e) => {
    e.preventDefault();
    
    // Get user data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    // Check if user exists and is a student
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    // MAJOR CHANGE: Check user role
    if (user.role === "instructor") {
      alert("Instructors cannot enroll in courses");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/student/enroll/${item._id}/${user._id}`
      );

      if (response.data.sessionId) {
        window.location.href = response.data.url; // Redirect for payment
      } else {
        alert(response.data.message || "Enrolled Successfully!");
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert(error.response?.data?.message || "Failed to enroll. Try again later.");
    }
  };




return (
  <div className="courseCard">
    <img src={item.thumbnail || "/images/default-cover.jpg"} alt="Course Cover" />
    <div className="info">
      <div className="header-row">
        <div className="title-section">
          <h3>{item.title || "Untitled Course"}</h3>
          <p className="instructor">
            {isLoading ? "Loading..." : error ? (
              <span style={{ color: "red" }}>Error</span>
            ) : (
              item.instructorName || instructorData?.username || "Unknown Instructor"
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

