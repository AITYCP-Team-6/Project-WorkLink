import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>WorkLink</h1>
        <p>
          A platform to manage temporary staff, events, and volunteer
          participation efficiently.
        </p>

        <div className="home-actions">
          <button onClick={() => navigate("/admin")}>Admin Dashboard</button>

          <button onClick={() => navigate("/organizer")}>
            Organizer Dashboard
          </button>

          <button onClick={() => navigate("/volunteer")}>
            Volunteer Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
