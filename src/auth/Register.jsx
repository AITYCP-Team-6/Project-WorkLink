import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Register</h2>

        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />

        <select required>
          <option value="">Select Role</option>
          <option value="organizer">Organizer</option>
          <option value="volunteer">Volunteer</option>
        </select>

        <button type="submit">Register</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
