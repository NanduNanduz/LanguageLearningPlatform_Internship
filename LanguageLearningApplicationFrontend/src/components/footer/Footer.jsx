import React from 'react'
import './Footer.scss'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="container">
        <div className="top">
        <div className="item">
            <h2>Languages</h2>
            <span>English</span>
            <span>Spanish</span>
            <span>French</span>
            <span>German</span>
            <span>Mandarin</span>
            <span>Japanese</span>
            <span>Korean</span>
            <span>Italian</span>
            <span>Portuguese</span>
            <span>Russian</span>
            <span>More Languages</span>
          </div>

          <div className="item">
            <h2>About</h2>
            <span>Our Story</span>
            <span>Why Fluencia?</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Affiliate Program</span>
            <span>Partnerships</span>
            <span>Contact Us</span>
          </div>

          <div className="item">
            <h2>Support</h2>
            <span>Help Center</span>
            <span>FAQs</span>
            <span>Learning Tips</span>
            <span>Technical Support</span>
          </div>

          <div className="item">
            <h2>Community</h2>
            <span>Success Stories</span>
            <span>Discussion Forums</span>
            <span>Language Meetups</span>
            <span>Events & Webinars</span>
            <span>Blog</span>
            <span>Teacher Portal</span>
            <span>Student Portal</span>
            <span>Refer a Friend</span>
          </div>

          <div className="item">
            <h2>More from Fluencia</h2>
            <span>Fluencia for Business</span>
            <span>Fluencia Pro</span>
            <span>Fluencia Mobile App</span>
            <span>Fluencia Insights</span>
            <span>Certificate Programs</span>
            <span>Language Challenges</span>
            <span>Live Tutoring</span>
            <span>AI Language Coach</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>Fluencia</h2>
            <span>© Fluencia International Ltd. 2025</span>
          </div>
          <div className="right">
            <div className="social">
              <img src="/images/twitter.png" alt="" />
              <img src="/images/facebook.png" alt="" />
              <img src="/images/linkedin.png" alt="" />
              <img src="/images/pinterest.png" alt="" />
              <img src="/images/instagram.png" alt="" />
            </div>
          <div className="link">
            <img src="/images/language.png" alt="" />
            <span>English</span>
          </div>
          <div className="link">
            <img src="/images/coin.png" alt="" />
            <span>USD</span>
          </div>
          <img src="/images/accessibility.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer