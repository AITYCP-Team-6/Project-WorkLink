import "./Navbar.css";

const Navbar = ({ role = "User", title }) => {
  return (
    <header className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        {title ? (
          <h2 className="page-title">{title}</h2>
        ) : (
          <span className="brand">WorkLink</span>
        )}
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <div className="login-info">
          <span className="role-label">Logged in as</span>
          <strong className="role">{role}</strong>
        </div>

        <div className="avatar" title={role}>
          {role.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
