// import { AppBar, Box, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Hidden } from '@mui/material';
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const drawer = (
//     <List>
//       <ListItem button component={Link} to={'/'}>
//         <ListItemText primary="Home" />
//       </ListItem>
//       <ListItem button component={Link} to={'/login'}>
//         <ListItemText primary="Login" />
//       </ListItem>
//       <ListItem button component={Link} to={'/signup'}>
//         <ListItemText primary="Signup" />
//       </ListItem>
//     </List>
//   );

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static" className='bg-transparent shadow-none pb-2' >
//         <Toolbar>
//           <img src="/Images/video-editing-app.png" alt="" style={{width:'50px'}} className='mt-2 me-3' />
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='mt-3'>
//             CINESTREAM
//           </Typography>
//           <Hidden mdUp>
//             <IconButton edge="end" color="inherit" onClick={toggleDrawer}>
//               <span className="material-icons "><img style={{width:"20px"}} src="https://img.icons8.com/?size=100&id=dMz54mFbVirR&format=png&color=000000" alt="icon" /></span>
//             </IconButton>
//             <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer}>
//               {drawer}
//             </Drawer>
//           </Hidden>
//           <Hidden mdDown >
//             <Link to={'/'}><Button color="inherit">Home</Button></Link>
//             <Link to={'/login'}><Button color="inherit">Login</Button></Link>
//             <Link to={'/signup'}><Button color="inherit">Signup</Button></Link>
//           </Hidden>
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// };

// export default Navbar;

import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ currentUser, setCurrentUser }) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);

    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  // Fetch profile picture when the component mounts
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (currentUser?._id) {
        try {
          const response = await axios.get(
            `http://localhost:3000/user/profile/${currentUser._id}`
          );
          setProfilePicture(response.data.user?.profilePicture || null);
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };

    fetchProfilePicture();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.clear(); // Clears all localStorage items
      sessionStorage.clear(); // Clears sessionStorage
      setCurrentUser(null); // Clear currentUser state
      window.history.pushState(null, null, "/login");
      window.location.replace("/login"); // Ensure no back navigation
    } catch (err) {
      console.log(err);
    }
  };

  const goToProfile = () => {
    navigate("/profileStudent", { state: { student: currentUser } });
    setOpen(false); // Close the dropdown
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link to={"/"} className="link">
            <span className="text">Fluencia</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <Link className="link" to="/courses">
            Courses
          </Link>
          <Link className="link" to="/contactus">
            Contact Us
          </Link>

          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              {/* Profile Picture */}
              <img
                src={profilePicture || "/images/noavatar.jpg"}
                alt="Profile"
              />
              <span>{currentUser?.username}</span>
              {/* Dropdown Menu */}
              {open && (
                <div className="options">
                  {/* Profile (Visible to all users) */}
                  <Link className="link" onClick={goToProfile}>
                    Profile
                  </Link>

                  {/* Enrolled Courses (Visible to students) */}
                  {currentUser.role === "student" && (
                    <Link className="link" to="/enrolledCourses">
                      Enrolled Courses
                    </Link>
                  )}

                  {/* Add Course and My Courses (Visible to instructors) */}
                  {currentUser.role === "instructor" && (
                    <>
                      <Link className="link" to="/add">
                        Add Course
                      </Link>
                      <Link className="link" to="/mygigs">
                        My Courses
                      </Link>
                    </>
                  )}

                  {/* Orders and Messages (Visible to all users) */}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>

                  {/* Logout (Visible to all users) */}
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
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
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("English")}`}
            >
              English
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("Spanish")}`}
            >
              Spanish
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("French")}`}
            >
              French
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("German")}`}
            >
              German
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("Mandarin")}`}
            >
              Mandarin
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("Japanese")}`}
            >
              Japanese
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("Hindi")}`}
            >
              Hindi
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("Russian")}`}
            >
              Russian
            </Link>
            <Link
              className="link menuLink"
              to={`/gigs?cat=${encodeURIComponent("Italian")}`}
            >
              Italian
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
};

export default Navbar;