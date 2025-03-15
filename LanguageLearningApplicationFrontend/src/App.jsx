import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PrivateRoutes from "./PrivateRoutes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Studenthome from "./pages/student/Studenthome";
import InstructorHome from "./pages/instructor/InstructorHome";
import Navbar from "./components/navbar/Navbar";
import Students from "./pages/admin/Students";
import Course from "./pages/admin/Course"
import AddCourse from "./pages/instructor/AddCourse";
import Coursepage from "./pages/instructor/Coursepage";
import Resourcespage from "./pages/instructor/Resourcespage";
import QuizzPage from "./pages/instructor/QuizzPage";
import UpdateCourse from "./pages/instructor/UpdateCourse";


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Navbar />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/studentHome" element={<Studenthome />} />
        <Route path="/instructorHome" element={<InstructorHome />} />
        <Route path="/student-management" element={<Students />} />
        <Route path="/course-management" element={<Course />} />
        <Route path="/addCourse" element={<AddCourse />} />
        <Route path="/coursePage/:courseId" element={<Coursepage />} />
        <Route path="/addResources/:courseId" element={<Resourcespage />} />
        <Route path="/addquiz/:courseId" element={<QuizzPage />} />
        <Route path="/updateCourse/:courseId" element={<UpdateCourse />} />

      </Route>
    </Routes>
  );
}

export default App;