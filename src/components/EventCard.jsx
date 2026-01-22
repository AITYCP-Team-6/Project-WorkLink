import { Card, Button, Badge } from 'react-bootstrap';

const EventCard = ({ event, onApply, isApplied }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title>{event.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{event.orgName}</Card.Subtitle>
          </div>
          <Badge bg="info">{event.role}</Badge>
        </div>
        
        <Card.Text className="mt-2">
          {event.description}
        </Card.Text>
        
        <div className="text-muted small mb-3">
          <div>📅 {event.date} | ⏰ {event.time}</div>
          <div>📍 {event.location} | 💰 ${event.pay}/hr</div>
        </div>

        {isApplied ? (
          <Button variant="secondary" disabled>Applied</Button>
        ) : (
          <Button variant="primary" onClick={() => onApply(event.id)}>Apply Now</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default EventCard;
