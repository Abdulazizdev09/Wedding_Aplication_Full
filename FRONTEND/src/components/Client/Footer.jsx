import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">HallBooker</h3>
            <p className="footer-description">
              Your trusted partner for booking the perfect halls for any occasion.
              Find and reserve premium venues with ease.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/client" className="footer-link">Home</Link></li>
              <li><Link to="/client/halls" className="footer-link">All Halls</Link></li>
              <li><Link to="/client/bookings" className="footer-link">My Bookings</Link></li>
              <li><a href="#" className="footer-link">About Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Services</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Wedding Halls</a></li>
              <li><a href="#" className="footer-link">Conference Rooms</a></li>
              <li><a href="#" className="footer-link">Event Venues</a></li>
              <li><a href="#" className="footer-link">Party Halls</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Us</h4>
            <div className="contact-info">
              <p className="contact-item">
                <span className="contact-label">Phone:</span>
                +998(94)1551868
              </p>
              <p className="contact-item">
                <span className="contact-label">Email:</span>
                yusupovabdulaziz222@gmail.com
              </p>
              <p className="contact-item">
                <span className="contact-label">Address:</span>
                Uzbekistan,Tashkent, Sergeli, PDP University
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2025 Yusupov Abdulaziz. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;