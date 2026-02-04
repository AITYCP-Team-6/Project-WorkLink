import React, { useState, useEffect } from 'react';
import { 
  Clock, Plus, X, Filter, CheckCircle, XCircle, 
  AlertCircle, Calendar, Users, TrendingUp, LogOut,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './AttendanceTracker.css';

const AttendanceTracker = () => {
  const { isManager } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filters, setFilters] = useState({ event: '', staff: '', status: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event: { id: '' },
    staff: { id: '' },
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'PRESENT',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, eventsRes, staffRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/events'),
        api.get('/staff')
      ]);
      
      setAttendance(attendanceRes.data.data);
      setEvents(eventsRes.data.data);
      setStaff(staffRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterAttendance = () => {
    let filtered = attendance;
    
    if (filters.event) {
      filtered = filtered.filter(a => a.event.id === parseInt(filters.event));
    }
    if (filters.staff) {
      filtered = filtered.filter(a => a.staff.id === parseInt(filters.staff));
    }
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    
    return filtered;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      event: { id: parseInt(formData.event.id) },
      staff: { id: parseInt(formData.staff.id) },
      date: new Date(formData.date).toISOString(),
      checkIn: new Date(formData.checkIn).toISOString(),
      checkOut: formData.checkOut ? new Date(formData.checkOut).toISOString() : null,
      status: formData.status,
      notes: formData.notes
    };
    
    setActionLoading(true);
    try {
      await api.post('/attendance', submitData);
      setShowForm(false);
      setFormData({
        event: { id: '' },
        staff: { id: '' },
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        status: 'PRESENT',
        notes: ''
      });
      await fetchData();
      alert('Attendance marked successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error marking attendance');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckout = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/attendance/${id}/checkout`);
      await fetchData();
      alert('Checkout successful!');
    } catch (error) {
      alert('Error updating checkout');
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ event: '', staff: '', status: '' });
  };

  const hasActiveFilters = filters.event || filters.staff || filters.status;

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="loading-spinner"></div>
        <p>Loading attendance records...</p>
      </div>
    );
  }

  const filteredAttendance = filterAttendance();
  
  const calculateSummary = () => {
    return {
      total: filteredAttendance.length,
      present: filteredAttendance.filter(a => a.status === 'PRESENT').length,
      absent: filteredAttendance.filter(a => a.status === 'ABSENT').length,
      late: filteredAttendance.filter(a => a.status === 'LATE').length,
      totalHours: filteredAttendance.reduce((sum, a) => sum + (a.hoursWorked || 0), 0)
    };
  };

  const summary = calculateSummary();

  return (
    <div className="attendance-tracker-container">
      {/* Page Header */}
      <div className="attendance-page-header">
        <h1 className="attendance-page-title">
          <Clock size={32} />
          Attendance Tracker
        </h1>
        {isManager && (
          <div className="header-actions">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            >
              {showForm ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Mark Attendance
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <h2 className="summary-header">
          <TrendingUp size={20} />
          Attendance Summary
        </h2>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">
              <FileText size={20} />
            </div>
            <div className="summary-label">Total Records</div>
            <div className="summary-value">{summary.total}</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <CheckCircle size={20} />
            </div>
            <div className="summary-label">Present</div>
            <div className="summary-value">{summary.present}</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <XCircle size={20} />
            </div>
            <div className="summary-label">Absent</div>
            <div className="summary-value">{summary.absent}</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <AlertCircle size={20} />
            </div>
            <div className="summary-label">Late</div>
            <div className="summary-value">{summary.late}</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <Clock size={20} />
            </div>
            <div className="summary-label">Total Hours</div>
            <div className="summary-value">{summary.totalHours.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      {showForm && isManager && (
        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">
              <CheckCircle size={20} />
              Mark Attendance
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid two-col">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={14} />
                  Event <span className="required">*</span>
                </label>
                <select
                  value={formData.event.id}
                  onChange={(e) => setFormData({...formData, event: { id: e.target.value }})}
                  className="form-select"
                  required
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users size={14} />
                  Staff Member <span className="required">*</span>
                </label>
                <select
                  value={formData.staff.id}
                  onChange={(e) => setFormData({...formData, staff: { id: e.target.value }})}
                  className="form-select"
                  required
                >
                  <option value="">Select Staff</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} />
                Date <span className="required">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div className="form-grid two-col">
              <div className="form-group">
                <label className="form-label">
                  <Clock size={14} />
                  Check In <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <LogOut size={14} />
                  Check Out (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="form-select"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="EXCUSED">Excused</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="form-textarea"
                placeholder="Additional notes..."
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Mark Attendance
                </>
              )}
            </button>
          </form>
        </div>
      )}

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
          <div className="form-group">
            <label className="form-label">Event</label>
            <select 
              value={filters.event}
              onChange={(e) => setFilters({...filters, event: e.target.value})}
              className="form-select"
            >
              <option value="">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Staff</label>
            <select 
              value={filters.staff}
              onChange={(e) => setFilters({...filters, staff: e.target.value})}
              className="form-select"
            >
              <option value="">All Staff</option>
              {staff.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="EXCUSED">Excused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Staff</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
              {isManager && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={isManager ? 8 : 7}>
                  <div className="empty-state">
                    <Clock className="empty-icon" size={80} />
                    <h3 className="empty-title">No Attendance Records Found</h3>
                    <p className="empty-description">
                      {hasActiveFilters 
                        ? 'Try adjusting your filters to see more results.' 
                        : 'Attendance records will appear here once marked.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAttendance.map(record => (
                <tr key={record.id}>
                  <td>{record.event.title}</td>
                  <td>{record.staff.name}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{new Date(record.checkIn).toLocaleTimeString()}</td>
                  <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                  <td className="hours-cell">{record.hoursWorked?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status === 'PRESENT' && <CheckCircle size={14} />}
                      {record.status === 'ABSENT' && <XCircle size={14} />}
                      {record.status === 'LATE' && <AlertCircle size={14} />}
                      {record.status}
                    </span>
                  </td>
                  {isManager && (
                    <td>
                      <div className="action-buttons">
                        {!record.checkOut && (
                          <button 
                            onClick={() => handleCheckout(record.id)}
                            className="btn-sm btn-success"
                            disabled={actionLoading}
                          >
                            <LogOut size={14} />
                            Check Out
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracker;