import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import { useVolunteer } from "../../context/VolunteerContext";

const OrganizerApplications = () => {
  const { applications, approveApplication } = useVolunteer();

  return (
    <div className="app-layout">
      <Sidebar role="organizer" />

      <div className="content-area">
        <Navbar role="Organizer" title="Volunteer Applications" />

        <div className="table-card">
          <h3>Pending Applications</h3>

          {applications.length === 0 ? (
            <p>No pending applications.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Volunteer Role</th>
                    <th>Date</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.event}</td>
                      <td>{app.role}</td>
                      <td>{app.date}</td>
                      <td>{app.hours}</td>
                      <td>
                        <span className="status pending">Pending</span>
                      </td>
                      <td>
                        <button
                          className="btn approve"
                          onClick={() => approveApplication(app.id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerApplications;
