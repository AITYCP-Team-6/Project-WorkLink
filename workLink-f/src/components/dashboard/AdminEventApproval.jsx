import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import api from '../../services/api';
import './AdminEventApprovals.css';

const AdminEventApprovals = ({ onActionComplete }) => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get('/admin/events/pending');
      setPendingEvents(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending events:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    if (!window.confirm('Approve this event?')) return;
    
    try {
      await api.put(`/admin/events/${eventId}/approve`);
      alert('Event approved successfully!');
    fetchPendingEvents();
    if (onActionComplete) onActionComplete();
    } catch (error) {
      alert('Error approving event');
    }
  };

  const handleReject = async (eventId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      await api.put(`/admin/events/${eventId}/reject`, {
        reason: rejectionReason
      });
      alert('Event rejected');
      setShowRejectModal(null);
      setRejectionReason('');
      fetchPendingEvents();
    } catch (error) {
      alert('Error rejecting event');
    }
  };

  return (
    <div className="admin-approvals-container">
      <h2 className="section-title">
        <Clock size={24} />
        Pending Event Approvals ({pendingEvents.length})
      </h2>

      {pendingEvents.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={80} className="empty-icon" />
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="approvals-grid">
          {pendingEvents.map(event => (
            <div key={event.id} className="approval-card">
              <div className="approval-header">
                <h3>{event.title}</h3>
                <span className="pending-badge">
                  <Clock size={16} />
                  Pending
                </span>
              </div>

              <div className="approval-details">
                <p><strong>Organization:</strong> {event.createdBy.name}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
                <p><strong>Budget:</strong> ₹{event.budget}</p>
                <p><strong>Required Staff:</strong> {event.requiredStaff}</p>
              </div>

              <div className="approval-description">
                <p>{event.description}</p>
              </div>

              <div className="approval-actions">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="btn-view"
                >
                  <Eye size={18} />
                  View Details
                </button>
                <button
                  onClick={() => handleApprove(event.id)}
                  className="btn-approve"
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(event.id)}
                  className="btn-reject"
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Event</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(null)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={() => handleReject(showRejectModal)} className="btn-confirm">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventApprovals;