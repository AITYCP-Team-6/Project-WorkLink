import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // clear auth + localStorage
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="sidebar">
      <h2 className="logo">WorkLink</h2>

      <ul className="menu">
        {/* DASHBOARD */}
        <li>
          <NavLink to={`/${role}`} className="nav-link">
            Dashboard
          </NavLink>
        </li>

        {/* ADMIN LINKS */}
        {role === "admin" && (
          <>
            <li>
              <NavLink to="/admin/manage-users" className="nav-link">
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/payments" className="nav-link">
                Payments
              </NavLink>
            </li>
          </>
        )}

        {/* ORGANIZER LINKS */}
        {role === "organizer" && (
          <>
            <li>
              <NavLink to="/organizer/create-event" className="nav-link">
                Create Event
              </NavLink>
            </li>
            <li>
              <NavLink to="/organizer/applications" className="nav-link">
                Applications
              </NavLink>
            </li>

            <li>
              <NavLink to="/organizer/payments" className="nav-link">
                Payments
              </NavLink>
            </li>
          </>
        )}

        {/* VOLUNTEER LINKS */}
        {role === "volunteer" && (
          <>
            <li>
              <NavLink to="/volunteer/jobs" className="nav-link">
                My Tasks
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/applications" className="nav-link">
                My Applications
              </NavLink>
            </li>
            <li>
              <NavLink to="/volunteer/payments" className="nav-link">
                Payments
              </NavLink>
            </li>
          </>
        )}

        {/* COMMON */}
        <li>
          <NavLink to={`/${role}/reports`} className="nav-link">
            Reports
          </NavLink>
        </li>

        {/* LOGOUT */}
        <li className="logout" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
