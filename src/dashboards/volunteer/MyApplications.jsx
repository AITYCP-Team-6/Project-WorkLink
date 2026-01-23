import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./MyApplications.css";
import { useVolunteer } from "../../context/VolunteerContext";

const MyApplications = () => {
  const { applications } = useVolunteer();

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
                    <td>{app.date}</td>
                    <td>
                      <span className="status pending">pending</span>
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
