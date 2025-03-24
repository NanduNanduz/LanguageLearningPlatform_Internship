

// import React, { useEffect, useRef, useState } from "react";
// import "./Courses.scss";
// import GigCard from "../../components/gigCard/GigCard";
// import { useQuery } from "@tanstack/react-query";
// import newRequest from "../../utils/newRequest";
// import { useLocation } from "react-router-dom";

// const Courses = () => {
//   const [open, setOpen] = useState(false);
//   const [sort, setSort] = useState("sales");
//   const minRef = useRef();
//   const maxRef = useRef();

//   const { search } = useLocation();
//   const queryParams = new URLSearchParams(search);
//   const category = queryParams.get("cat") || ""; // Extract category from URL
//   const searchQuery = queryParams.get("search")?.toLowerCase().replace(/\s+/g, ""); // Normalize search

//   // Fetch gigs based on category, budget, and sorting

//   const { isLoading, error, data, refetch } = useQuery({
//     queryKey: ["gigs", category, sort],
//     queryFn: () =>
//       newRequest
//         .get(
//           `/gigs?cat=${category}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
//         )
//         .then((res) => res.data),
//   });

//   console.log(data);

//   const reSort = (type) => {
//     setSort(type);
//     setOpen(false);
//   };

//   useEffect(() => {
//     // refetch();
//   }, [sort, category]); // Refetch data when category changes

//   const apply = () => {
//     refetch();
//   };

//   // Filter gigs based on search query
//   const filteredGigs = data
//     ? data.filter((gig) =>
//         gig.title.toLowerCase().replace(/\s+/g, "").includes(searchQuery || "")
//       )
//     : [];


//   return (
//     <div className="gigs">
//       <div className="container">
//         <span className="breadcrumbs">gigSync {'>'} {category} {'>'}</span>
//         <h1>{category || "All Gigs"}</h1>
//         <p>Explore top-quality services in {category || "various categories"}</p>
//         <div className="menu">
//           <div className="left">
//             <span>Budget</span>
//             <input ref={minRef} type="number" placeholder="min" />
//             <input ref={maxRef} type="number" placeholder="max" />
//             <button onClick={apply}>Apply</button>
//           </div>
//           <div className="right">
//             <span className="sortBy">Sort By</span>
//             <span className="sortType">
//               {sort === "sales" ? "Best Selling" : "Newest"}
//             </span>
//             <img src="/images/down.png" alt="" onClick={() => setOpen(!open)} />
//             {open && (
//               <div className="rightMenu">
//                 {sort === "sales" ? (
//                   <span onClick={() => reSort("createdAt")}>Newest</span>
//                 ) : (
//                   <span onClick={() => reSort("sales")}>Best Selling</span>
//                 )}
//                 <span onClick={() => reSort("sales")}>Popular</span>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="cards">
//           {isLoading ? (
//             "Loading"
//           ) : error ? (
//             "Something went wrong!"
//           ) : filteredGigs.length > 0 ? (
//             filteredGigs.map((gig) => <GigCard key={gig._id} item={gig} />)
//           ) : (
//             <p>No gigs found for this category</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Courses;

import React, { useEffect, useRef, useState } from "react";
import "./Courses.scss";
import CourseCard from "../../components/courseCard/CourseCard";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Courses = () => {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("sales");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]); // Renamed to courses for clarity
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const category = queryParams.get("cat") || ""; // Extract category from URL
  const searchQuery = queryParams.get("search")?.toLowerCase().replace(/\s+/g, ""); // Normalize search

  // Fetch approved courses using axios
  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/student/approved-courses");
      setCourses(response.data?.courses || []); // Set courses from the response
    } catch (err) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []); // Fetch courses on component mount

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    fetchCourses(); // Refetch courses when filters are applied
  };

  // Filter courses based on search query, category, and budget
  const filteredCourses = courses
    .filter((course) => {
      // Filter by category
      if (category && course.category !== category) return false;

      // Filter by search query
      if (searchQuery && !course.title.toLowerCase().replace(/\s+/g, "").includes(searchQuery)) {
        return false;
      }

      // Filter by budget
      const minPrice = minRef.current?.value ? parseFloat(minRef.current.value) : 0;
      const maxPrice = maxRef.current?.value ? parseFloat(maxRef.current.value) : Infinity;
      if (course.price < minPrice || course.price > maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by sales, createdAt, or other criteria
      if (sort === "sales") {
        return b.totalSales - a.totalSales; // Sort by total sales (descending)
      } else if (sort === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by newest
      }
      return 0;
    });

  return (
    <div className="courses">
      <div className="container">
        <span className="breadcrumbs">Courses {'>'} {category} {'>'}</span>
        <h1>{category || "All Courses"}</h1>
        <p>Explore top-quality courses in {category || "various categories"}</p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort By</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="/images/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id} item={course} />
            ))
          ) : (
            <p>No courses found for this category</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;