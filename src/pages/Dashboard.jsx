import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import VolunteerDashboard from './VolunteerDashboard';
import OrganizationDashboard from './OrganizationDashboard';
import { Container, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Alert variant="danger">Unauthorized Access</Alert>;
  }

  return (
    <Container className="py-4">
      {user.role === 'VOLUNTEER' && <VolunteerDashboard />}
      {user.role === 'ORGANIZATION' && <OrganizationDashboard />}
    </Container>
  );
};

export default Dashboard;
