import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./AdminDashboard.css";

/* Chart config – MUST be imported once */
import "../../components/ChartConfig";
import { Bar, Doughnut } from "react-chartjs-2";

const AdminDashboard = () => {
  const userChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Users",
        data: [200, 400, 650, 900, 1240],
        backgroundColor: "#4f46e5",
      },
    ],
  };

  const approvalChartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: ["#16a34a", "#f59e0b", "#ef4444"],
      },
    ],
  };

  return (
    <div className="app-layout">
      <Sidebar role="admin" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Admin" title="System Overview" />

        {/* STATS CARDS */}
        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Users</p>
            <h2>1,240</h2>
          </div>

          <div className="stat-card">
            <p>Active Events</p>
            <h2>3</h2>
          </div>

          <div className="stat-card">
            <p>Pending Approvals</p>
            <h2 className="warning">5</h2>
          </div>

          <div className="stat-card">
            <p>Revenue Processed</p>
            <h2 className="success">$45k</h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="charts">
          <div className="chart-box">
            <h3>User Growth</h3>
            <Bar data={userChartData} />
          </div>

          <div className="chart-box">
            <h3>Approval Status</h3>
            <Doughnut data={approvalChartData} />
          </div>
        </div>

        {/* RECENT USERS TABLE */}
        <div className="table-card">
          <h3>Recent User Registrations</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>Volunteer</td>
                  <td>
                    <span className="status verified">Verified</span>
                  </td>
                  <td className="edit">Edit</td>
                </tr>

                <tr>
                  <td>TechFlow Events</td>
                  <td>Organizer</td>
                  <td>
                    <span className="status verified">Verified</span>
                  </td>
                  <td className="edit">Edit</td>
                </tr>

                <tr>
                  <td>Super Admin</td>
                  <td>Admin</td>
                  <td>
                    <span className="status verified">Verified</span>
                  </td>
                  <td className="edit">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
