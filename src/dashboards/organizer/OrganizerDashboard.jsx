import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import "../../styles/layout.css";
import "./OrganizerDashboard.css";
import { useEvents } from "../../context/EventContext";

const OrganizerDashboard = () => {
  const { events } = useEvents();

  const totalEvents = events.length;
  const totalVolunteers = events.length * 6; // dummy logic for UI
  const pendingPayments = 120; // static for now

  return (
    <div className="app-layout">
      <Sidebar role="organizer" />

      <div className="content-area">
        {/* NAVBAR */}
        <Navbar role="Organizer" title="Organizer Dashboard" />

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Events</p>
            <h2>{totalEvents}</h2>
          </div>

          <div className="stat-card">
            <p>Volunteers Assigned</p>
            <h2>{totalVolunteers}</h2>
          </div>

          <div className="stat-card">
            <p>Pending Payments</p>
            <h2 className="warning">${pendingPayments}</h2>
          </div>
        </div>

        {/* EVENTS LIST */}
        <div className="table-card organizer-events">
          <h3>My Events</h3>

          {events.length === 0 ? (
            <p className="empty-text">No events created yet.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Slots</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                      <td>{event.slots}</td>
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

export default OrganizerDashboard;
