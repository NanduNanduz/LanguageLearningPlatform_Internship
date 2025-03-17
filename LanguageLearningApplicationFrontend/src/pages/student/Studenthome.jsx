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
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Studenthome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.user;
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/student/enrolledCourses/${student?._id}`
        );
        setEnrolledCourses(response.data?.courses || []);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/profile/${student?._id}`);
        setProfilePicture(response.data.user?.profilePicture || null);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    if (student?._id) {
      fetchEnrolledCourses();
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Top Bar */}
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: isMobile ? "center" : "left" }}>
            Student Dashboard
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
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Container sx={{ flexGrow: 1, padding: 3, marginLeft: isMobile ? 0 : "240px" }}>
        <Typography variant="h4" gutterBottom align="center">
          Your Enrolled Courses
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <Grid item key={course._id} xs={12} sm={6} md={4}>
                <Card sx={{ minWidth: 250 }}>
                  <CardContent>
                    <Typography variant="h6">{course.title}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" color="primary" component={Link} to={`/coursePage/${course._id}`}>
                      View Course
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography color="textSecondary" align="center">
              No enrolled courses found.
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Studenthome;
