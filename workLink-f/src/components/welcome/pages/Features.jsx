import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

export default function Features() {
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
        <section className="page-hero">
          <h1>WorkLink Features</h1>
          <p>
            A comprehensive workforce management system designed to streamline
            operations, accountability, and coordination across organizations.
          </p>
        </section>

        <section className="page-content">
          <div className="card-grid">
            <div className="info-card">
              <h3>Centralized Workforce Management</h3>
              <p>
                WorkLink provides a single platform where administrators can
                oversee workforce data, monitor engagement, and maintain control
                over organizational operations.
              </p>
            </div>

            <div className="info-card">
              <h3>Role-Based Access Control</h3>
              <p>
                The system enforces strict role-based permissions ensuring that
                administrators, organizers, and volunteers access only the
                features relevant to their responsibilities.
              </p>
            </div>

            <div className="info-card">
              <h3>Task & Assignment Management</h3>
              <p>
                Organizers can create tasks, assign workforce members, track
                task progress, and manage workload distribution efficiently.
              </p>
            </div>

            <div className="info-card">
              <h3>Monitoring & Reporting</h3>
              <p>
                Administrators gain access to operational reports that provide
                insights into workforce participation and task completion.
              </p>
            </div>

            <div className="info-card">
              <h3>Secure Authentication</h3>
              <p>
                Built-in authentication and authorization mechanisms ensure data
                security and protect sensitive workforce information.
              </p>
            </div>

            <div className="info-card">
              <h3>Scalable Architecture</h3>
              <p>
                WorkLink is designed to scale with organizational growth, making
                it suitable for institutions and enterprises.
              </p>
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