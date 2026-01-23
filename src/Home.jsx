import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="home-header">
        <h1 className="logo">WorkLink</h1>
        <div className="home-actions">
          <button className="btn-outline" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <h2>Manage Events & Temporary Staff Effortlessly</h2>
        <p>
          WorkLink helps organizations manage volunteers, payments, and event
          operations with transparency and efficiency.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/register")}>Register Now</button>
          <button className="secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>For Admins</h3>
          <p>
            Monitor users, approve registrations, manage payments, and generate
            system reports.
          </p>
        </div>

        <div className="feature-card">
          <h3>For Organizers</h3>
          <p>
            Create events, assign volunteers, track work hours, and manage
            payouts easily.
          </p>
        </div>

        <div className="feature-card">
          <h3>For Volunteers</h3>
          <p>
            Find events, apply for tasks, track completed work, and view
            earnings transparently.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <p>© 2026 WorkLink. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
