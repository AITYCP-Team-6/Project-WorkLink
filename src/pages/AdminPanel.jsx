console.log("AdminPanel rendered");

import { Container, Table, Badge, Button } from 'react-bootstrap';

const AdminPanel = () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', role: 'VOLUNTEER', status: 'Active' },
    { id: 2, name: 'Tech Events Inc', role: 'ORGANIZATION', status: 'Pending Verification' },
  ];

  return (
    <Container className="py-4">
      <h2>Admin Control Panel</h2>
      <p className="text-muted">Manage users and system settings.</p>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>
                <Badge bg={u.status === 'Active' ? 'success' : 'warning'}>{u.status}</Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanel;
