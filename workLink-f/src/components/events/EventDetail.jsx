import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Tag, IndianRupee, Users, 
  Clock, Edit, Trash2, UserPlus, Mail, Phone, Award,
  CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isManager } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    if (isManager) fetchAvailableStaff();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setLoading(false);
    }
  };

  const fetchAvailableStaff = async () => {
    try {
      const response = await api.get('/staff');
      setAvailableStaff(response.data.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleAllocateStaff = async () => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }
    
    setActionLoading(true);
    try {
      await api.post(`/events/${id}/allocate`, { staffId: parseInt(selectedStaff) });
      await fetchEventDetails();
      setSelectedStaff('');
      alert('Staff allocated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error allocating staff');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStaff = async (staffId) => {
    if (!window.confirm('Remove this staff member from the event?')) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}/allocate/${staffId}`);
      await fetchEventDetails();
      alert('Staff removed successfully!');
    } catch (error) {
      alert('Error removing staff');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (error) {
      alert('Error deleting event');
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      UPCOMING: { bg: '#dbeafe', text: '#1e40af' },
      ONGOING: { bg: '#fef3c7', text: '#92400e' },
      COMPLETED: { bg: '#d1fae5', text: '#065f46' },
      CANCELLED: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || colors.UPCOMING;
  };

  const calculateProgress = () => {
    const allocated = event?.allocatedStaff?.length || 0;
    const required = event?.requiredStaff || 1;
    return Math.min((allocated / required) * 100, 100);
  };

  if (loading) {
    return (
      <div className="event-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-container">
        <div className="empty-state">
          <XCircle className="empty-icon" size={80} />
          <h2 className="empty-title">Event Not Found</h2>
          <p className="empty-description">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(event.status);

  return (
    <div className="event-detail-container">
      {/* Header Section */}
      <div className="event-detail-header">
        <Link to="/events" className="back-button">
          <ArrowLeft size={20} />
          <span>Back to Events</span>
        </Link>

        <div className="header-top">
          <div className="header-content">
            <h1 className="event-title">{event.title}</h1>
            <p className="event-description">{event.description}</p>
            <div style={{ marginTop: '16px' }}>
              <span 
                className="status-badge"
                style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
              >
                {event.status === 'UPCOMING' && <Clock size={16} />}
                {event.status === 'ONGOING' && <Calendar size={16} />}
                {event.status === 'COMPLETED' && <CheckCircle size={16} />}
                {event.status === 'CANCELLED' && <XCircle size={16} />}
                {event.status}
              </span>
            </div>
          </div>

          {isManager && (
            <div className="event-actions">
              <Link to={`/events/edit/${id}`} className="btn btn-primary">
                <Edit size={18} />
                Edit
              </Link>
              <button 
                onClick={handleDeleteEvent} 
                className="btn btn-danger"
                disabled={actionLoading}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Event Meta Information */}
        <div className="event-meta-grid">
          <div className="meta-item">
            <div className="meta-icon">
              <MapPin size={20} />
            </div>
            <div className="meta-content">
              <div className="meta-label">Location</div>
              <div className="meta-value">{event.location}</div>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <Calendar size={20} />
            </div>
            <div className="meta-content">
              <div className="meta-label">Start Date</div>
              <div className="meta-value">
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <Clock size={20} />
            </div>
            <div className="meta-content">
              <div className="meta-label">End Date</div>
              <div className="meta-value">
                {new Date(event.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <Tag size={20} />
            </div>
            <div className="meta-content">
              <div className="meta-label">Category</div>
              <div className="meta-value">{event.category}</div>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <IndianRupee size={20} />
            </div>
            <div className="meta-content">
              <div className="meta-label">Budget</div>
              <div className="meta-value">${event.budget?.toFixed(2) || '0.00'}</div>
            </div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <Users size={20} />
            </div>
            <div className="meta-content">
              <div className="meta-label">Staff Capacity</div>
              <div className="meta-value">
                {event.allocatedStaff?.length || 0} / {event.requiredStaff}
              </div>
            </div>
          </div>
        </div>

        {/* Staff Progress Bar */}
        <div className="staff-progress">
          <div className="progress-header">
            <span className="progress-label">Staff Allocation Progress</span>
            <span className="progress-value">{calculateProgress().toFixed(0)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Staff Allocation Section */}
      <div className="staff-allocation-section">
        <div className="section-header">
          <h2 className="section-title">
            <Users size={24} />
            Allocated Staff ({event.allocatedStaff?.length || 0})
          </h2>
        </div>

        {/* Allocation Form (Manager Only) */}
        {isManager && (
          <div className="staff-allocation-form">
            <div className="allocation-form-row">
              <div className="form-group">
                <label className="form-label">Select Staff Member</label>
                <select 
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="form-select"
                  disabled={actionLoading}
                >
                  <option value="">Choose a staff member...</option>
                  {availableStaff
                    .filter(s => !event.allocatedStaff?.some(as => as.id === s.id))
                    .map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} - {staff.email} (${staff.hourlyRate}/hr)
                      </option>
                    ))}
                </select>
              </div>
              <button 
                onClick={handleAllocateStaff} 
                className="btn btn-primary"
                disabled={!selectedStaff || actionLoading}
              >
                <UserPlus size={18} />
                Allocate Staff
              </button>
            </div>
          </div>
        )}

        {/* Staff List */}
        {!event.allocatedStaff || event.allocatedStaff.length === 0 ? (
          <div className="empty-state">
            <Users className="empty-icon" size={80} />
            <h3 className="empty-title">No Staff Allocated</h3>
            <p className="empty-description">
              {isManager 
                ? 'Start by allocating staff members to this event using the form above.' 
                : 'Staff members will be assigned to this event soon.'}
            </p>
          </div>
        ) : (
          <div className="staff-list">
            {event.allocatedStaff.map((staff) => (
              <div key={staff.id} className="staff-card">
                <div className="staff-avatar">
                  {staff.name.charAt(0).toUpperCase()}
                </div>
                <div className="staff-info">
                  <h3 className="staff-name">{staff.name}</h3>
                  <div className="staff-details">
                    <span className="staff-detail-item">
                      <Mail size={16} />
                      {staff.email}
                    </span>
                    {staff.phone && (
                      <span className="staff-detail-item">
                        <Phone size={16} />
                        {staff.phone}
                      </span>
                    )}
                    <span className="staff-detail-item">
                      <IndianRupee size={16} />
                      ${staff.hourlyRate}/hr
                    </span>
                  </div>
                  {staff.skills && staff.skills.length > 0 && (
                    <div className="staff-skills">
                      {staff.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">
                          <Award size={12} />
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {isManager && (
                  <div className="staff-actions">
                    <button 
                      onClick={() => handleRemoveStaff(staff.id)}
                      className="btn btn-danger btn-sm"
                      disabled={actionLoading}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;