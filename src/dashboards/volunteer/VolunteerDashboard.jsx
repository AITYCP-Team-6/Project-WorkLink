import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./VolunteerDashboard.css";
import { useEvents } from "../../context/EventContext";

const VolunteerDashboard = () => {
  const { events } = useEvents();
  const [appliedEvents, setAppliedEvents] = useState([]);

  const applyEvent = (event) => {
    if (appliedEvents.find((e) => e.id === event.id)) return;
    setAppliedEvents([...appliedEvents, event]);
  };

  return (
    <div className="app-layout">
      <Sidebar role="volunteer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Volunteer" title="Find Jobs" />

        {/* EVENTS LIST */}
        <div className="job-list">
          {events.length === 0 ? (
            <p className="empty-text">No events available right now.</p>
          ) : (
            events.map((event) => {
              const applied = appliedEvents.some((e) => e.id === event.id);

              return (
                <div key={event.id} className="job-card">
                  <h3>{event.title}</h3>
                  <p className="org">{event.org}</p>

                  <div className="job-info">
                    <p>📅 {event.date}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {event.slots}</p>
                  </div>

                  {applied ? (
                    <button className="btn applied" disabled>
                      Applied
                    </button>
                  ) : (
                    <button
                      className="btn apply"
                      onClick={() => applyEvent(event)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
