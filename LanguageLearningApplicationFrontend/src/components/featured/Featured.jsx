import React, { useState } from "react";
import './Featured.scss'
import { Link, useNavigate } from "react-router-dom";

const Featured = ({  onLearnMoreClick ,isLoggedIn }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  };

  return (
    <div className='featured'>
        <div className="container">
            <div className="left">
                <h1>"Learn, Teach, and Grow with Expert-Led Courses"</h1>
                <div className="search">
                    <div className="searchInput">
                        {/* <img src="./images/search.png" alt="" /> */}
                        <input 
                            type="text" 
                            placeholder='Search your course'
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSubmit}><img src="./images/search.png" alt="" /></button>
                </div>
                <div className="popular">
                    {isLoggedIn ? (
                        <Link to={`/courses`}><button>Explore Courses</button></Link>
                        ) : (
                        <Link to={`/signup`}><button>Get Started</button></Link>
                        )}
                        <button onClick={onLearnMoreClick}>Learn More</button>
                </div>
            </div>
            <div className="right">
                <img src="./images/newwoman.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Featured