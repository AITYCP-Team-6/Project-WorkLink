import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

export default function About() {
  return (
    <>
      {/* NAVBAR (SAME AS FEATURES) */}
      <header className="home-navbar">
        <div className="nav-container">
          <div className="nav-logo">WorkLink</div>

          <nav className="nav-menu">
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
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

      {/* PAGE CONTENT */}
      <div className="page-root">
        <section className="page-hero about-hero">
          <h1>About WorkLink</h1>
          <p>
            A structured workforce management solution built to improve
            coordination, transparency, and operational efficiency.
          </p>
        </section>

        <section className="page-content">
          <div className="about-card enhanced">
            <div className="about-section">
              <span className="about-tag">Overview</span>
              <h3>What is WorkLink?</h3>
              <p>
                WorkLink is a workforce management platform that enables
                organizations to manage users, assign tasks, monitor
                performance, and maintain operational control through a
                centralized system.
              </p>
            </div>

            <div className="about-divider" />

            <div className="about-section">
              <span className="about-tag">Problem</span>
              <h3>Challenges in Workforce Management</h3>
              <p>
                Traditional workforce management relies on manual processes,
                disconnected tools, and limited visibility, leading to
                inefficiency and poor accountability.
              </p>
            </div>

            <div className="about-divider" />

            <div className="about-section">
              <span className="about-tag">Solution</span>
              <h3>How WorkLink Helps</h3>
              <p>
                WorkLink provides a unified, role-based platform where
                administrators, organizers, and workforce members operate within
                a secure, access-controlled workflow.
              </p>
            </div>

            <div className="about-divider" />

            <div className="about-grid">
              <div className="about-mini-card">
                <h4>Target Users</h4>
                <p>
                  Institutions, enterprises, and teams that require structured
                  workforce coordination and secure task management.
                </p>
              </div>

              <div className="about-mini-card">
                <h4>Vision</h4>
                <p>
                  To build a reliable, scalable, and secure workforce management
                  ecosystem that enhances productivity and accountability.
                </p>
              </div>
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