import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center mb-5">
        <Col md={8}>
          <h1 className="display-4 fw-bold">Connecting Volunteers with Opportunities</h1>
          <p className="lead text-muted mb-4">
            WorkLink is the easiest way to manage temporary staff, track attendance, and process payments.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button as={Link} to="/login" variant="primary" size="lg">Get Started</Button>
            <Button variant="outline-secondary" size="lg">Learn More</Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <h3>For Volunteers</h3>
              <p>Find flexible shifts, track your hours, and get paid instantly.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <h3>For Organizations</h3>
              <p>Post events, manage applications, and automate attendance.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm p-3">
            <Card.Body>
              <h3>For Admins</h3>
              <p>Oversee the entire ecosystem with powerful reporting tools.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
