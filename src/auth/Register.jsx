import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("volunteer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // For now just log (later connect Spring Boot)
    console.log("Registered User:", { role, ...form });

    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Register</h2>

        {/* ROLE SELECT */}
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="organizer">Organizer</option>
          <option value="volunteer">Volunteer</option>
        </select>

        {/* COMMON FIELDS */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        {/* ORGANIZER ONLY */}
        {role === "organizer" && (
          <input
            type="text"
            name="organization"
            placeholder="Organization Name"
            value={form.organization}
            onChange={handleChange}
            required
          />
        )}

        {/* VOLUNTEER ONLY */}
        {role === "volunteer" && (
          <input
            type="text"
            name="skills"
            placeholder="Skills (e.g. Registration, Tech Support)"
            value={form.skills}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
