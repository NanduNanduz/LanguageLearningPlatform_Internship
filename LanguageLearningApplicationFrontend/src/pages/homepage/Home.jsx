import React, { useState } from "react";
import './Home.scss'


// import Slide from '../../components/Slide/Slide';
import {cards, projects} from '../../data'

// import ProjectCard from "../../components/projectCard/ProjectCard";
import { Link } from "react-router-dom";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Featured from "../../components/featured/Featured";

import Slide from "../../components/slider/Slider";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import CatCard from "../../components/catCard/CatCard";


const Home = () => {
    
    const location = useLocation();

    // useEffect(() => {
    //     if (location.hash === "#gigSyncBusiness") {
    //         document.getElementById("gigSyncBusiness")?.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [location]);
    return (
      <div className="home">
        <Featured/>
        <TrustedBy/>
        <div className="popular-courses">
          <h2>Popular Courses</h2>
          <p className="description">Our course list is arranged with those skills which are currently in <br /> most demand in the country and outside the country.</p>
        </div>
        <Slide slidesToShow={5} arrowsScroll={true}>
          {cards.map((card) => (
            <CatCard key={card.id} card={card} />
          ))}
        </Slide>
    
        <div className="features">
          <div className="container">
            <div className="item">
              <h1>Unlock a World of Language Learning</h1>
              <div className="title">
                <img src="/images/check.png" alt="" />
                Learn at Your Own Pace
              </div>
              <p>Access high-quality courses designed to fit your schedule. Learn anytime, anywhere.</p>

              <div className="title">
                <img src="/images/check.png" alt="" />
                Expert-Led Lessons
              </div>
              <p>Learn from experienced instructors with interactive video lessons and real-world practice.</p>

              <div className="title">
                <img src="/images/check.png" alt="" />
                Secure & Seamless Learning
              </div>
              <p>Enjoy a smooth learning experience with protected payments and verified courses.</p>

              <div className="title">
                <img src="/images/check.png" alt="" />
                24/7 Learning Support
              </div>
              <p>Get instant help from our support team and community whenever you need guidance.</p>
            </div>
            <div className="item">
              <video src="/images/newVideo.mp4" controls></video>
            </div>
          </div>
        </div>



        <div className="features dark">
          <div className="container">
            <div className="item">
              <h1>Why Choose Us?</h1>
              <p><i>Enhance your learning experience with expert-led courses, interactive lessons, and certifications—available anytime, anywhere.</i>
              </p>
              <div className="title">
                <img src="/images/check.png" alt="" />
                Expert Instructors
              </div>
              <div className="title">
                <img src="/images/check.png" alt="" />
                Interactive Learning
              </div>
              <div className="title">
                <img src="/images/check.png" alt="" />
                Quizzes & Certifications
              </div>
              <div className="title">
                <img src="/images/check.png" alt="" />
                24/7 Access to Courses
              </div>
              <button>Explore Courses</button>
            </div>
            <div className="item">
              <img src="https://sg.fiverrcdn.com/press_release/1068/Press-Page%20-%201_press_image_1600171796.jpg" alt="" />
            </div>
          </div>
        </div>
        {/* <Slide slidesToShow={4} arrowsScroll={1}>
        {projects.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </Slide> */}
        
      </div>
    );
  };
  
  export default Home;

  
