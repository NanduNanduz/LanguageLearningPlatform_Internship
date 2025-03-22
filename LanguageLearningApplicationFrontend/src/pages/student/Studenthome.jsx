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
  TextField,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Studenthome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const studentData = location.state?.user;

  const [courses, setCourses] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const categoryOptions = [
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Urdu",
    "Gujarati",
    "Kannada",
    "Odia",
    "Punjabi",
    "Malayalam",
    "Assamese",
    "Maithili",
    "Santali",
    "Kashmiri",
    "Konkani",
    "Sindhi",
    "Dogri",
    "Manipuri",
    "Bodo",
    "Sanskrit",
    "Nepali",
    "English",
    "Spanish",
    "French",
    "German",
    "Portuguese",
    "Chinese",
    "Cantonese",
    "Japanese",
    "Korean",
    "Russian",
    "Italian",
    "Turkish",
    "Dutch",
    "Polish",
    "Greek",
    "Hebrew",
    "Arabic",
    "Persian (Farsi)",
    "Thai",
    "Vietnamese",
    "Malay",
    "Swedish",
    "Danish",
    "Finnish",
    "Norwegian",
    "Hungarian",
    "Czech",
    "Slovak",
    "Romanian",
    "Ukrainian",
    "Filipino (Tagalog)",
    "Swahili",
  ];


const [student, setStudent] = useState(null);

useEffect(() => {
  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    setStudent(JSON.parse(storedUser));
  } else {
    console.warn("Student data not found in session storage");
  }
}, []);




  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/student/approved-courses"
        );
        setCourses(response.data?.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/profile/${student?._id}`
        );
        setProfilePicture(response.data.user?.profilePicture || null);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchCourses();
    if (student?._id) {
      fetchProfileDetails();
    }
  }, [student]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const goToProfile = () => {
    navigate("/profileStudent", { state: { student } });
    handleClose();
  };

  const handleViewEnrolledCourses = () => {
    navigate("/enrolledCourses", { state: { student } });
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category) {
      setFilteredCourses(
        courses.filter((course) => course.category === category)
      );
    } else {
      setFilteredCourses(courses);
    }
  };
  


const handleEnroll = async (courseId) => {
  if (!student || !student._id) {
    alert("Student information is missing. Please try logging in again.");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:3000/student/enroll/${courseId}/${student._id}`
    );

    if (response.data.sessionId) {
      // If payment is required, redirect to Stripe payment
      window.location.href = response.data.url;
    } else {
      alert(response.data.message || "Enrolled Successfully!");
    }
  } catch (error) {
    console.error("Enrollment failed:", error);
    alert("Failed to enroll. Try again later.");
  }
};

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Top Bar */}
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textAlign: isMobile ? "center" : "left" }}
          >
            Student Dashboard
          </Typography>
          <TextField
            label="Search Courses"
            variant="outlined"
            size="small"
            sx={{ marginRight: 2, backgroundColor: "white", borderRadius: 1 }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Category Filter */}
          <FormControl sx={{ minWidth: 200, marginRight: 2 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select value={selectedCategory} onChange={handleCategoryChange}>
              <MenuItem value="">All</MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button color="inherit" onClick={handleViewEnrolledCourses}>
            View Enrolled Courses
          </Button>
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Avatar src={profilePicture || ""} alt="Profile">
              {!profilePicture && <AccountCircleIcon />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={goToProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItem>
            <ListItemText primary={`Welcome, ${student?.name}`} />
          </ListItem>
          
        </List>
      </Drawer>

      {/* Main Content */}
      <Container
        sx={{ flexGrow: 1, padding: 3, marginLeft: isMobile ? 0 : "240px" }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Available Courses
        </Typography>
        <Grid container spacing={3} justifyContent="center">
  {courses.length > 0 ? (
    courses.map((course) => (
      <Grid item key={course._id} xs={12} sm={6} md={3}>
        <Card
          sx={{
            minWidth: 200,
            maxWidth: 260,
            borderRadius: 3,
            boxShadow: 3,
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 6,
            },
          }}
        >
          {/* Course Thumbnail */}
          <Box
            component="img"
            src={course.thumbnail}
            alt={course.title}
            sx={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />

          <CardContent sx={{ padding: "12px" }}>
            {/* Course Title */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {course.title}
            </Typography>

            {/* Course Description (Shortened) */}
            <Typography variant="body2" color="textSecondary">
              {course.description.length > 60
                ? `${course.description.substring(0, 60)}...`
                : course.description}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: "space-between", paddingBottom: 2 }}>
            {/* View Course Button */}
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/coursePageStudent/${course._id}`}
              sx={{ borderRadius: 2, fontSize: "0.75rem", padding: "6px 12px" }}
            >
              View
            </Button>

            {/* Enroll Button */}
            <Button
              variant="contained"
              color="success"
              onClick={() => handleEnroll(course._id)}
              sx={{ borderRadius: 2, fontSize: "0.75rem", padding: "6px 12px" }}
            >
              Enroll
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
  );
};

export default Studenthome;
