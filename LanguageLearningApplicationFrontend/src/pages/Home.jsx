import React, { useState } from "react";
import Slider from "react-slick";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useMediaQuery,
  useTheme,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoginForm from "./LoginForm";
import SignupModal from "./SignupModal";

const imageUrls = [
  "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920",
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920",
  "https://images.pexels.com/photos/256540/pexels-photo-256540.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920",
  "https://images.pexels.com/photos/374703/pexels-photo-374703.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920",
];

const Home = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <>
      <Box sx={{ position: "relative", width: "100vw", height: isMobile ? "50vh" : "100vh", overflow: "hidden" }}>
        <Slider {...settings}>
          {imageUrls.map((url, index) => (
            <Box
              key={index}
              sx={{
                width: "100vw",
                height: isMobile ? "50vh" : "100vh",
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
        </Slider>

        <AppBar position="absolute" sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", boxShadow: "none" }}>
          <Toolbar>
            <Typography variant={isMobile ? "h6" : "h5"} sx={{ flexGrow: 1 }}>
              Language App
            </Typography>
            <Button color="inherit" onClick={() => setOpenLogin(true)}>
              Login
            </Button>
            <Button color="inherit" onClick={() => setOpenSignup(true)}>
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Intro Section */}
      <Box sx={{ textAlign: "center", p: 5 }}>
        <Typography variant="h3" fontWeight="bold">
          Learn faster with the best 1-on-1 language tutor for you.
        </Typography>
        <Typography variant="body1" color={theme.palette.grey[400]} sx={{ mt: 2 }}>
          Take online lessons tailored to your level, budget, and schedule.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          {[
            { label: "Expert tutors", value: "50K+" },
            { label: "Subjects", value: "180+" },
            { label: "Trial lessons", value: "25min" },
          ].map((stat, index) => (
            <Box key={index} sx={{ mx: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="body2">{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: "#1e1e1e", py: 5, textAlign: "center", color: "white" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Language, business skills, and much more
        </Typography>
        <Typography variant="body1" color={theme.palette.grey[400]} sx={{ mb: 4 }}>
          Learn various skills with expert tutors in different fields.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: "Online Classes", color: "#ff5c5c", icon: "📚" },
            { title: "Translation", color: "#00b894", icon: "🌍" },
            { title: "Trainings", color: "#ff5c5c", icon: "💼" },
            { title: "Seminars", color: "#00b894", icon: "🎤" },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ backgroundColor: "white", borderRadius: 3 }}>
                <Box sx={{ backgroundColor: item.color, py: 2, borderTopLeftRadius: 3, borderTopRightRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" color="white">
                    {item.title}
                  </Typography>
                </Box>
                <CardContent>
                  <Typography variant="h3">{item.icon}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn and enhance your skills with our expert-led programs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", p: 5, backgroundColor: "#ff5c5c", color: "white" }}>
        <Box component="img" src="https://images.pexels.com/photos/3769714/pexels-photo-3769714.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Why Choose Us" sx={{ width: isMobile ? "100%" : "50%", borderRadius: 2 }} />
        <Box sx={{ flex: 1, ml: isMobile ? 0 : 4, textAlign: "left" }}>
          <Typography variant="h4" fontWeight="bold">Why Choose Us</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </Typography>
          <ul>
            <li>Improve Your Career & Business</li>
            <li>Build Deeper Connections With More People</li>
            <li>Sharpen Your Decision-Making</li>
            <li>Feed Your Brain</li>
            <li>Treasure Other Cultures</li>
            <li>See the World (More Fully)</li>
          </ul>
        </Box>
      </Box>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} fullScreen={isMobile}>
        <DialogTitle textAlign="center">Login</DialogTitle>
        <DialogContent>
          <LoginForm onClose={() => setOpenLogin(false)} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setOpenLogin(false)} color="error" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signup Modal */}
      {openSignup && <SignupModal onClose={() => setOpenSignup(false)} />}
    </>
  );
};

export default Home;
