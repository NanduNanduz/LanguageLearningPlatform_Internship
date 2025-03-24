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

import React, { useEffect, useState } from "react";
import "./CourseCard.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const CourseCard = ({ item }) => {
  const [instructorData, setInstructorData] = useState(null); // Renamed to instructorData for clarity
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!item) return <div>Error: Course data is missing</div>;

  console.log("Item:", item);

  // Fetch instructor data using axios
  useEffect(() => {
    const fetchInstructorData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:3000/users/${item.userId}`); // Correct endpoint for fetching user data
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

  return (
    <Link to={`/course/${item._id}`} className="link">
      <div className="courseCard">
        {/* Course Thumbnail */}
        <img src={item.thumbnail || "/images/default-cover.jpg"} alt="Course Cover" />
        <div className="info">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            <span style={{ color: "red" }}>Error: {error}</span>
          ) : (
            <div className="user">
              {/* Instructor Avatar */}
              <img src={item.profilePicture || "/images/noavatar.jpg"} alt="Instructor Avatar" />
              {/* Instructor Name */}
              <span>{item.instructorName || "Unknown Instructor"}</span>
            </div>
          )}
          {/* Course Description */}
          <p>{item.description || "No description available"}</p>
        </div>
        <hr />
        <div className="details">
          {/* Like Button */}
          <img src="/images/heart.png" alt="Like" />
          {/* Course Price */}
          <div className="price">
            <span>STARTING AT</span>
            <h2>${item.price || "N/A"}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;