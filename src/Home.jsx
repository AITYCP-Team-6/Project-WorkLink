import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>WorkLink</h1>
          <p>
            Smart workforce management platform connecting administrators,
            organizers, and volunteers in one seamless ecosystem.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="btn primary">
              Get Started
            </Link>
            <Link to="/about" className="btn secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose WorkLink?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Centralized Management</h3>
            <p>
              Admins can manage events, approvals, and users from a single
              dashboard with complete visibility.
            </p>
          </div>

          <div className="feature-card">
            <h3>Role-Based Dashboards</h3>
            <p>
              Dedicated dashboards for organizers and volunteers, designed for
              clarity, speed, and productivity.
            </p>
          </div>

          <div className="feature-card">
            <h3>Real-Time Coordination</h3>
            <p>
              Assign tasks, track participation, and ensure smooth event
              execution without communication gaps.
            </p>
          </div>

          <div className="feature-card">
            <h3>Scalable & Secure</h3>
            <p>
              Built with modern web technologies ensuring performance, security,
              and future scalability.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow">
        <h2>How It Works</h2>

        <div className="workflow-steps">
          <div className="step">
            <span>01</span>
            <h4>Create Events</h4>
            <p>Organizers create and submit events for admin approval.</p>
          </div>

          <div className="step">
            <span>02</span>
            <h4>Assign Volunteers</h4>
            <p>Volunteers apply and get assigned tasks effortlessly.</p>
          </div>

          <div className="step">
            <span>03</span>
            <h4>Track & Manage</h4>
            <p>Admins monitor progress and ensure smooth execution.</p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="cta">
        <h2>Ready to Streamline Workforce Management?</h2>
        <p>
          Join WorkLink and experience structured, efficient, and transparent
          workforce coordination.
        </p>
        <Link to="/register" className="btn primary large">
          Create Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} WorkLink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
