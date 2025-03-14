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

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Navbar/>}/>
      <Route element={<PrivateRoutes/>} >
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/studentHome" element={<Studenthome/>} />
            <Route path="/instructorHome" element={<InstructorHome/>} />
      </Route>    
    </Routes>
  );
}

export default App;