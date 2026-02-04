import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

export default function Contact() {
  return (
    <>
      {/* NAVBAR */}
      <header className="home-navbar">
        <div className="nav-container">
          <div className="nav-logo">WorkLink</div>

          <nav className="nav-menu">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/about">About</Link>
            <Link to="/contact" className="active">
              Contact
            </Link>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="nav-login">
              Login
            </Link>
            <Link to="/register" className="nav-register">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* PAGE ROOT */}
      <div className="page-root">
        {/* HERO */}
        <section className="page-hero">
          <h1>Contact & Support</h1>
          <p>
            Need help with workforce coordination or system access? Our support
            team is here to assist you.
          </p>
        </section>

        {/* CONTENT */}
        <section className="page-content">
          <div className="contact-card enhanced">
            <div className="contact-item">
              <span>Support Email</span>
              <p>support@worklink.com</p>
            </div>

            <div className="contact-item">
              <span>Technical Assistance</span>
              <p>
                For login issues, task assignment problems, or feature-related
                concerns, reach out to the system administrator or support team.
              </p>
            </div>

            <div className="contact-item">
              <span>Office Location</span>
              <p>Mumbai, Maharashtra, India</p>
            </div>

            <div className="contact-item">
              <span>Working Hours</span>
              <p>Monday – Friday, 9:00 AM to 6:00 PM</p>
            </div>

            <div className="contact-note">
              We typically respond within <strong>24 business hours</strong>.
            </div>
          </div>
        </section>
      </div>
      {/* FOOTER */}
      <footer className="home-footer">
        © {new Date().getFullYear()} WorkLink — Workforce & Event Management
        System
      </footer>
    </>
  );
}