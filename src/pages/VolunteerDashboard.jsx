import { useEffect, useState } from 'react';
import { Tabs, Tab, Alert } from 'react-bootstrap';
import EventCard from '../components/EventCard';

const VolunteerDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents([
      { id: 1, title: 'Tech Conference', orgName: 'TechCorp', description: 'Help needed at registration.', date: '2025-05-20', time: '9:00 AM', location: 'City Hall', role: 'Usher', pay: 15 },
      { id: 2, title: 'Charity Run', orgName: 'Red Cross', description: 'Handing out water.', date: '2025-06-10', time: '7:00 AM', location: 'Central Park', role: 'Helper', pay: 12 },
    ]);
  }, []);

  const handleApply = (id) => {
    alert(`Applied to event ID: ${id}`);
  };

  return (
    <>
      <h3>Volunteer Dashboard</h3>

      <Tabs defaultActiveKey="available" className="mb-3">
        <Tab eventKey="available" title="Available Opportunities">
          {events.map(event => (
            <EventCard key={event.id} event={event} onApply={handleApply} isApplied={false} />
          ))}
        </Tab>

        <Tab eventKey="my-apps" title="My Applications">
          <Alert variant="info">You haven't applied to any events yet.</Alert>
        </Tab>
      </Tabs>
    </>
  );
};

export default VolunteerDashboard;
