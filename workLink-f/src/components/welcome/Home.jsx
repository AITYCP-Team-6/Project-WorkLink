import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-root">
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

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>
            WorkLink
            <span> - Workforce Management</span>
          </h1>
          <p>
            A centralized and secure portal for administrators, organizers, and
            volunteers to manage events, approvals, assignments, and workforce
            coordination efficiently.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn-outline">
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="roles-section">
        <h2>User Roles</h2>

        <div className="roles-grid">
          <div className="role-card">
            <div className="role-badge">ADMIN</div>
            <h3>Administrator</h3>
            <p>
              Reviews and approves events, manages users, monitors system
              activity, and ensures secure platform operations.
            </p>
          </div>

          <div className="role-card highlight">
            <div className="role-badge">ORG</div>
            <h3>Organizer</h3>
            <p>
              Creates and manages events, assigns volunteers, tracks progress,
              and coordinates operations in real time.
            </p>
          </div>

          <div className="role-card">
            <div className="role-badge">VOL</div>
            <h3>Volunteer</h3>
            <p>
              Applies for events, receives task assignments, and tracks assigned
              responsibilities through a clear dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        © {new Date().getFullYear()} WorkLink — Workforce & Event Management
        System
      </footer>
    </div>
  );
}