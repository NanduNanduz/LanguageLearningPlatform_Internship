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
import UpdateCourse from "./pages/instructor/Updatecourse";
import Instructors from "./pages/admin/Instructors";
import InstructorProfile from "./pages/instructor/InstructorProfile";
import CourseDetails from "./pages/admin/CourseDetails";
import StudentProfile from "./pages/student/StudentProfile";
import EnrolledCourses from "./pages/student/EnrolledCourses";
import CoursePageStudent from "./pages/student/CoursePageStudent";
import AdminTransactions from "./pages/admin/Transaction";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import SendAnnouncement from "./pages/admin/SendAnnouncement";
import Notifications from "./pages/student/Notifications";



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
        <Route path="/instructor-management" element={<Instructors />} />
        <Route path="/course-management" element={<Course />} />
        <Route path="/addCourse" element={<AddCourse />} />
        <Route path="/coursePage/:courseId" element={<Coursepage />} />
        <Route path="/addResources/:courseId" element={<Resourcespage />} />
        <Route path="/addquiz/:courseId" element={<QuizzPage />} />
        <Route path="/updateCourse/:courseId" element={<UpdateCourse />} />
        <Route path="/profileInstructor" element={<InstructorProfile />} />
        <Route path="/courseDetails/:courseId" element={<CourseDetails />} />
        <Route path="/profileStudent" element={<StudentProfile />} />
        <Route path="/enrolledCourses" element={<EnrolledCourses />} />
        <Route path="/send-announcement" element={<SendAnnouncement />} />
        <Route path="/notifications" element={<Notifications />}/>
        
        <Route
          path="/coursePageStudent/:courseId"
          element={<CoursePageStudent />}
        />
        <Route path="/user-transactions" element={<AdminTransactions />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Route>
    </Routes>
  );
}

export default App;