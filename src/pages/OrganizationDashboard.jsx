import { Tabs, Tab, Alert } from 'react-bootstrap';

const OrganizationDashboard = () => {
  return (
    <>
      <h3>Organization Dashboard</h3>

      <Tabs defaultActiveKey="my-events" className="mb-3">
        <Tab eventKey="my-events" title="My Events">
          <Alert variant="success">You have 2 active events.</Alert>
        </Tab>

        <Tab eventKey="create" title="Create Event">
          <p>Event creation form goes here.</p>
        </Tab>
      </Tabs>
    </>
  );
};

export default OrganizationDashboard;
