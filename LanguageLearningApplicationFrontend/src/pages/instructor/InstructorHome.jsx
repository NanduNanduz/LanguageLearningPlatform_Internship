import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CardActions,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
  CssBaseline
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240; // Sidebar width

const InstructorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const instructor = location.state?.user;
  const [courseDetails, setCourseDetails] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/instructor/courseDetails/${instructor?._id}`
        );
        setCourseDetails(response.data?.courses || []);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/profile/${instructor?._id}`);
        setProfilePicture(response.data.user?.profilePicture || null);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    if (instructor?._id) {
      fetchCourseDetails();
      fetchProfileDetails();
    }
  }, [instructor]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3000/instructor/delete-course/${courseId}`);
      setCourseDetails(courseDetails.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdate = (courseId) => navigate(`/updateCourse/${courseId}`);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const goToProfile = () => {
    navigate("/profileInstructor", { state: { instructor } });
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <List>
          <ListItem>
            <ListItemText primary={`Welcome, ${instructor?.name}`} sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem button component={Link} to="/addCourse" state={{ instructor }}>
            <ListItemText primary="Add Course" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin 0.3s",
          marginLeft: isMobile ? 0 : `${drawerWidth}px`, // Push content if sidebar is visible
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`, // Adjust width
        }}
      >
        {/* Top Bar */}
        <AppBar position="static">
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }}>
              Instructor Dashboard
            </Typography>
            <IconButton color="inherit" onClick={handleProfileClick}>
              <Avatar src={profilePicture || ""} alt="Profile">
                {!profilePicture && <AccountCircleIcon />}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={goToProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Course Section */}
        <Container
          sx={{
            flexGrow: 1,
            padding: 3,
            maxWidth: isMobile ? "100%" : "85%",
            margin: "auto",
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Your Courses
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {courseDetails.length > 0 ? (
              courseDetails.map((course) => (
                <Grid item key={course._id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      padding: 1,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {course.title}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button size="small" variant="contained" color="primary" component={Link} to={`/coursePage/${course._id}`}>
                        View
                      </Button>
                      <Button size="small" variant="contained" color="secondary" onClick={() => handleUpdate(course._id)}>
                        Update
                      </Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleDelete(course._id)}>
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary" align="center">
                No courses found.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default InstructorHome;
