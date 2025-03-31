import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";

const Navbar = ({ currentUser, setCurrentUser }) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  useEffect(() => {
    const userFromStorage = sessionStorage.getItem("user");
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      setCurrentUser(user);
      fetchProfilePicture(user._id);
      if (user.role === "student") {
        fetchNotifications(user._id); // Fetch notifications only for students
      }
    }
  }, [setCurrentUser]);

  const fetchProfilePicture = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile/${userId}`
      );
      setProfilePicture(response.data.user?.profilePicture || null);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/${userId}`
      );
      setNotificationCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.clear();
      setCurrentUser(null);
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const goToProfile = () => {
    if (!currentUser) return;

    if (currentUser.role === "student") {
      navigate("/profileStudent", { state: { user: currentUser } });
    } else if (currentUser.role === "instructor") {
      navigate("/profileInstructor", { state: { user: currentUser } });
    }
    setOpen(false);
  };

  const goToCourses = () => {
    if (!currentUser) {
      navigate("/courses");
      return;
    }

    if (currentUser.role === "student") {
      navigate("/enrolledCourses", { state: { user: currentUser } });
    } else {
      navigate("/instructorHome", { state: { user: currentUser } });
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link to={"/"} className="link">
            <span className="text">Fluencia</span>
          </Link>
        </div>

        <div className="links">
          <Link
            className="link"
            to={
              currentUser
                ? currentUser.role === "student"
                  ? "/enrolledCourses"
                  : "/mygigs"
                : "/courses"
            }
            onClick={(e) => {
              if (currentUser) {
                e.preventDefault();
                goToCourses();
              }
            }}
          >
            {!currentUser
              ? "Courses"
              : currentUser.role === "student"
              ? "Enrolled Courses"
              : "My Courses"}
          </Link>

          <Link className="link" to="/contactus">
            Contact Us
          </Link>

          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              {currentUser.role === "student" && (
                <Badge
                  badgeContent={notificationCount}
                  color="error"
                  sx={{ cursor: "pointer", marginRight: "10px" }}
                >
                  <NotificationsIcon
                    fontSize="medium"
                    onClick={() => navigate("/notifications")}
                  />
                </Badge>
              )}

              <img
                src={profilePicture || "/images/noavatar.jpg"}
                alt="Profile"
              />
              <span>{currentUser?.username}</span>

              {open && (
                <div className="options">
                  <span className="link" onClick={goToProfile}>
                    Profile
                  </span>

                  {currentUser.role === "instructor" && (
                    <Link
                      className="link"
                      to="/addCourse"
                      state={{ user: currentUser }}
                    >
                      Add Course
                    </Link>
                  )}

                  <span className="link" onClick={handleLogout}>
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/signup">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            {[
              "English",
              "Spanish",
              "French",
              "German",
              "Mandarin",
              "Japanese",
              "Hindi",
              "Russian",
              "Italian",
            ].map((language) => (
              <Link
                key={language}
                className="link menuLink"
                to={`/courses?cat=${encodeURIComponent(language)}`}
              >
                {language}
              </Link>
            ))}
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export default Navbar;
