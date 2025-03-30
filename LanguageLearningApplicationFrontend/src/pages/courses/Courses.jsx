import React, { useRef, useState } from "react";
import "./Courses.scss";
import CourseCard from "../../components/courseCard/CourseCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Courses = () => {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("sales");
  const minRef = useRef();
  const maxRef = useRef();
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const category = queryParams.get("cat") || "";
  const searchQuery = queryParams
    .get("search")
    ?.toLowerCase()
    .replace(/\s+/g, "");

  const { isLoading, error, data } = useQuery({
    queryKey: ["courses", category, sort, priceFilter],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/student/approved-courses"
      );
      return res.data;
    },
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    setPriceFilter({
      min: minRef.current?.value ? parseFloat(minRef.current.value) : 0,
      max: maxRef.current?.value ? parseFloat(maxRef.current.value) : Infinity,
    });
  };

  const coursesArray = data?.courses || [];
  const filteredCourses = coursesArray
    .filter((course) => {
      // Filter by category
      if (category && course.category !== category) return false;

      // Filter by search query
      if (
        searchQuery &&
        !course.title.toLowerCase().replace(/\s+/g, "").includes(searchQuery)
      ) {
        return false;
      }

      // Filter by budget
      if (course.price < priceFilter.min || course.price > priceFilter.max)
        return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "sales") {
        return b.totalSales - a.totalSales;
      } else if (sort === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <div className="courses">
      <div className="container">
        <span className="breadcrumbs">
          Courses {">"} {category} {">"}
        </span>
        <h1>{category || "All Courses"}</h1>
        <p>Explore top-quality courses in {category || "various categories"}</p>

        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input
              ref={minRef}
              type="number"
              placeholder="min"
              min="0"
              onKeyDown={(e) => e.key === "Enter" && apply()}
            />
            <input
              ref={maxRef}
              type="number"
              placeholder="max"
              min="0"
              onKeyDown={(e) => e.key === "Enter" && apply()}
            />
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
              </div>
            )}
          </div>
        </div>

        <div className="cards">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            <p style={{ color: "red" }}>
              {error.message || "Something went wrong!"}
            </p>
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
