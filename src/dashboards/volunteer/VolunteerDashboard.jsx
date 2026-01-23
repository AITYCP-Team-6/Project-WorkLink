import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./VolunteerDashboard.css";
import { useEvents } from "../../context/EventContext";
import { useVolunteer } from "../../context/VolunteerContext";

const VolunteerDashboard = () => {
  const { events } = useEvents();
  const { applications, applyForEvent } = useVolunteer();

  const hasApplied = (id) => applications.some((app) => app.id === id);

  return (
    <div className="app-layout">
      <Sidebar role="volunteer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Volunteer" title="Find Jobs" />

        <div className="job-list">
          {events.length === 0 ? (
            <p className="empty-text">No events available right now.</p>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="job-card">
                <h3>{evt.title}</h3>
                <p className="org">{evt.org}</p>

                <div className="job-info">
                  <p>📅 {evt.date}</p>
                  <p>📍 {evt.location}</p>
                  <p>👥 {evt.slots}</p>
                </div>

                {hasApplied(evt.id) ? (
                  <button className="btn applied" disabled>
                    Applied
                  </button>
                ) : (
                  <button
                    className="btn apply"
                    onClick={() => applyForEvent(evt)}
                  >
                    Apply
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
