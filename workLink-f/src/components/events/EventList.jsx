import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Plus, Filter, X, Search, MapPin, Clock,
  Users, IndianRupee, ArrowLeft, Tag, Grid, List, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './EventList.css';

const EventList = () => {
  const { isManager } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState({ status: '', category: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filter]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      // Filter out COMPLETED events so they don't appear in the event list
      const activeEvents = response.data.data.filter(e => e.status !== 'COMPLETED');
      setEvents(activeEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];
    if (filter.status) {
      filtered = filtered.filter(e => e.status === filter.status);
    }
    if (filter.category) {
      filtered = filtered.filter(e => e.category === filter.category);
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower)
      );
    }
    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setFilter({ status: '', category: '', search: '' });
  };

  const hasActiveFilters = filter.status || filter.category || filter.search;

  const calculateProgress = (allocated, required) => {
    return Math.min((allocated / required) * 100, 100);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      EXAM: '🎓',
      WORKSHOP: '🛠️',
      COMMUNITY: '🤝',
      SPORTS: '⚽',
      CHARITY: '❤️',
      OTHER: '📌'
    };
    return icons[category] || '📌';
  };

  const handlePostEvent = async (eventId) => {
    try {
      await api.put(`/events/${eventId}/post`);
      setEvents(prev =>
        prev.map(e => e.id === eventId ? { ...e, status: "POSTED" } : e)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to post event");
    }
  };

  const requestApproval = async (eventId, e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await api.put(`/events/${eventId}/request-approval`);
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId ? { ...event, approvalStatus: 'PENDING' } : event
        )
      );
      alert('Approval request sent to admin successfully!');
    } catch (error) {
      console.error('Approval Request Error:', error);
      alert('Failed to send approval request. Please try again.');
    }
  };

  const handleCardClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="event-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar size={32} />
            Events
            <span className="title-badge">{events.length}</span>
          </h1>
        </div>
        <Link to="/dashboard" className="btn-create">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        {isManager && (
          <Link to="/events/new" className="btn-create">
            <Plus size={20} />
            Create Event
          </Link>
        )}
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">
            <Filter size={18} />
            Filters
          </h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-filters-btn">
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <Search size={14} />
              Search
            </label>
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search events..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="search-input"
              />
            </div>
          </div>
          <div className="filter-group">
            <label className="filter-label">
              <CheckCircle size={14} />
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="POSTED">Posted</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">
              <Tag size={14} />
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="EXAM">🎓EXAM</option>
              <option value="WORKSHOP">🛠️ Workshop</option>
              <option value="COMMUNITY">🤝 Community</option>
              <option value="SPORTS">⚽ Sports</option>
              <option value="CHARITY">❤️ Charity</option>
              <option value="OTHER">📌 Other</option>
            </select>
          </div>
        </div>
      </div>
                            
      {/* Results Info */}
      <div className="results-info">
        <div className="results-count">
          Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
            Grid
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <Calendar className="empty-icon" size={120} />
          <h2 className="empty-title">
            {hasActiveFilters ? 'No events match your filters' : 'No events found'}
          </h2>
          <p className="empty-description">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more results.'
              : isManager
                ? 'Create your first event to get started!'
                : 'Events will appear here once they are created.'}
          </p>
          <div className="empty-actions">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn-create">
                <X size={20} />
                Clear Filters
              </button>
            )}
            {isManager && !hasActiveFilters && (
              <Link to="/events/new" className="btn-create">
                <Plus size={20} />
                Create First Event
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'events-grid' : 'events-list'}>
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className={viewMode === 'grid' ? 'event-card' : 'event-row'}
              onClick={() => handleCardClick(event.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="event-card-header">
                <h3 className="event-card-title">{event.title}</h3>
                <span className="event-card-category">
                  {getCategoryIcon(event.category)}
                  {event.category}
                </span>
              </div>

              <div className="event-card-body">
                <div className="event-info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Location</div>
                    <div className="info-value">{event.location}</div>
                  </div>
                </div>

                <div className="event-info-item">
                  <div className="info-icon">
                    <Clock size={18} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Date Range</div>
                    <div className="info-value">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })} - {new Date(event.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="event-info-item">
                  <div className="info-icon">
                    <IndianRupee size={18} />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Budget</div>
                    <div className="info-value">₹{event.budget?.toFixed(2) || '0.00'}</div>
                  </div>
                </div>

                {/* Approval Status Buttons */}
                <div className="approval-status-row">
                  {event.approvalStatus === 'CREATED' && isManager && (
                    <button
                      className="btn-action btn-request"
                      onClick={(e) => requestApproval(event.id, e)}
                    >
                      <CheckCircle size={16} />
                      Request Approval
                    </button>
                  )}

                  {event.approvalStatus === 'PENDING' && (
                    <button className="btn-status-display pending" disabled>
                      <Clock size={16} />
                      Requested (Pending)
                    </button>
                  )}

                  {event.approvalStatus === 'APPROVED' && (
                    <button className="btn-status-display approved" disabled>
                      <CheckCircle size={16} />
                      Approved
                    </button>
                  )}

                  {event.approvalStatus === 'REJECTED' && (
                    <button className="btn-status-display rejected" disabled>
                      <X size={16} />
                      Rejected
                    </button>
                  )}
                </div>
              </div>

              <div className="event-card-footer">
                <span className={`status-badge status-${event.status.toLowerCase()}`}>
                  {event.status}
                </span>
                <div className="staff-progress">
                  <Users size={16} />
                  {event.allocatedStaff?.length || 0}/{event.requiredStaff}
                  <div className="progress-bar-small">
                    <div
                      className="progress-fill-small"
                      style={{
                        width: `${calculateProgress(
                          event.allocatedStaff?.length || 0,
                          event.requiredStaff
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;