import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./ManageUsers.css";

const ManageUsers = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      role: "Volunteer",
      email: "john@example.com",
      status: "active",
    },
    {
      id: 2,
      name: "TechFlow Events",
      role: "Organizer",
      email: "contact@techflow.com",
      status: "pending",
    },
    {
      id: 3,
      name: "Super Admin",
      role: "Admin",
      email: "admin@worklink.com",
      status: "active",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="admin" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Admin" title="Manage Users" />

        {/* TABLE */}
        <div className="table-card manage-users">
          <h3>User Management</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`status ${
                          user.status === "active" ? "verified" : "pending"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn approve">Approve</button>
                      <button className="btn reject">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
