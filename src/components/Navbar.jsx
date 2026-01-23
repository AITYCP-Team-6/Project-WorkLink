import "./Navbar.css";

const Navbar = ({ role, title }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        {title && <h2 className="page-title">{title}</h2>}
      </div>

      <div className="navbar-right">
        <span className="login-info">
          Logged in as <b>{role}</b>
        </span>
        <div className="avatar">{role?.charAt(0).toUpperCase()}</div>
      </div>
    </div>
  );
};

export default Navbar;
