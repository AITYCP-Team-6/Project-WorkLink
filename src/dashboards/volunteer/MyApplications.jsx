import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./MyApplications.css";

const MyApplications = () => {
  const applications = [
    {
      id: 1,
      event: "City Tech Summit 2025",
      organizer: "TechFlow Events",
      role: "Registration Desk",
      date: "15 Mar 2025",
      status: "pending",
    },
    {
      id: 2,
      event: "Community Marathon",
      organizer: "City Sports Dept",
      role: "Water Station",
      date: "10 Feb 2025",
      status: "approved",
    },
    {
      id: 3,
      event: "Job Fair 2025",
      organizer: "Job Expo Org",
      role: "Help Desk",
      date: "05 Jan 2025",
      status: "rejected",
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="volunteer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Volunteer" title="My Applications" />

        {/* APPLICATIONS TABLE */}
        <div className="table-card my-applications">
          <h3>Applied Jobs</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Organizer</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.event}</td>
                    <td>{app.organizer}</td>
                    <td>{app.role}</td>
                    <td>{app.date}</td>
                    <td>
                      <span
                        className={`status ${
                          app.status === "approved"
                            ? "approved"
                            : app.status === "rejected"
                              ? "rejected"
                              : "pending"
                        }`}
                      >
                        {app.status}
                      </span>
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

export default MyApplications;
