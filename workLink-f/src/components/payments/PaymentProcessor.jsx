import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Calculator, Plus, X, Filter, DollarSign, 
  Clock, CheckCircle, TrendingUp, AlertCircle, Users,
  Calendar, FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './PaymentProcessor.css';

const PaymentProcessor = () => {
  const { isManager } = useAuth();
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [filters, setFilters] = useState({ event: '', staff: '', status: '' });
  const [formData, setFormData] = useState({
    event: { id: '' },
    staff: { id: '' },
    hoursWorked: 0,
    hourlyRate: 0,
    paymentMethod: 'BANK_TRANSFER',
    notes: ''
  });
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, eventsRes, staffRes] = await Promise.all([
        api.get('/payments'),
        api.get('/events'),
        api.get('/staff')
      ]);
      
      setPayments(paymentsRes.data.data);
      setEvents(eventsRes.data.data);
      setStaff(staffRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!formData.event.id || !formData.staff.id) {
      alert('Please select both event and staff member');
      return;
    }

    setActionLoading(true);
    try {
      const response = await api.post('/payments/calculate', {
        eventId: parseInt(formData.event.id),
        staffId: parseInt(formData.staff.id)
      });
      
      setCalculation(response.data.data);
      setFormData({
        ...formData,
        hoursWorked: response.data.data.totalHours,
        hourlyRate: response.data.data.hourlyRate
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error calculating payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      event: { id: parseInt(formData.event.id) },
      staff: { id: parseInt(formData.staff.id) },
      hoursWorked: parseFloat(formData.hoursWorked),
      hourlyRate: parseFloat(formData.hourlyRate),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    };
    
    setActionLoading(true);
    try {
      await api.post('/payments', submitData);
      setShowForm(false);
      setFormData({
        event: { id: '' },
        staff: { id: '' },
        hoursWorked: 0,
        hourlyRate: 0,
        paymentMethod: 'BANK_TRANSFER',
        notes: ''
      });
      setCalculation(null);
      await fetchData();
      alert('Payment processed successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    setActionLoading(true);
    try {
      await api.put(`/payments/${paymentId}/status`, { status: newStatus });
      await fetchData();
      alert('Payment status updated successfully!');
    } catch (error) {
      alert('Error updating payment status');
    } finally {
      setActionLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;
    
    if (filters.event) {
      filtered = filtered.filter(p => p.event.id === parseInt(filters.event));
    }
    if (filters.staff) {
      filtered = filtered.filter(p => p.staff.id === parseInt(filters.staff));
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    return filtered;
  };

  const clearFilters = () => {
    setFilters({ event: '', staff: '', status: '' });
  };

  const hasActiveFilters = filters.event || filters.staff || filters.status;

  if (loading) {
    return (
      <div className="payment-loading">
        <div className="loading-spinner"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  const filteredPayments = filterPayments();
  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = filteredPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalAmount - completedAmount;

  return (
    <div className="payment-processor-container">
      {/* Page Header */}
      <div className="payment-page-header">
        <h1 className="payment-page-title">
          <CreditCard size={32} />
          Payment Processing
        </h1>
        {isManager && (
          <div className="header-actions">
            <button 
              onClick={() => setShowCalculator(!showCalculator)} 
              className="btn btn-secondary"
            >
              <Calculator size={18} />
              {showCalculator ? 'Hide Calculator' : 'Calculate Payment'}
            </button>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn btn-primary"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? 'Cancel' : 'Process Payment'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <IndianRupee size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Payments</div>
              <div className="stat-value">${totalAmount.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>{filteredPayments.length} transactions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Completed</div>
              <div className="stat-value">${completedAmount.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-change positive">
            <CheckCircle size={16} />
            <span>
              {filteredPayments.filter(p => p.status === 'COMPLETED').length} paid
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Pending</div>
              <div className="stat-value">${pendingAmount.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-change">
            <AlertCircle size={16} />
            <span>
              {filteredPayments.filter(p => p.status === 'PENDING').length} pending
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Records</div>
              <div className="stat-value">{filteredPayments.length}</div>
            </div>
          </div>
          <div className="stat-change">
            <Calendar size={16} />
            <span>All time</span>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      {showCalculator && isManager && (
        <div className="calculator-section">
          <div className="section-header">
            <h2 className="section-title">
              <Calculator size={20} />
              Calculate Payment from Attendance
            </h2>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={14} />
                Event
              </label>
              <select
                value={formData.event.id}
                onChange={(e) => setFormData({...formData, event: { id: e.target.value }})}
                className="form-select"
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
                Staff Member
              </label>
              <select
                value={formData.staff.id}
                onChange={(e) => setFormData({...formData, staff: { id: e.target.value }})}
                className="form-select"
              >
                <option value="">Select Staff</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - ${member.hourlyRate}/hr
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <button 
                onClick={handleCalculate} 
                className="btn btn-primary"
                disabled={!formData.event.id || !formData.staff.id || actionLoading}
              >
                <Calculator size={18} />
                Calculate
              </button>
            </div>
          </div>

          {calculation && (
            <div className="calculation-result">
              <h3 className="result-title">
                <CheckCircle size={20} />
                Calculation Result
              </h3>
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-label">Total Hours</div>
                  <div className="result-value">
                    {calculation.totalHours?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Hourly Rate</div>
                  <div className="result-value">
                    ${calculation.hourlyRate?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Total Amount</div>
                  <div className="result-value highlight">
                    ${calculation.amount?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="result-item">
                  <div className="result-label">Attendance Records</div>
                  <div className="result-value">
                    {calculation.attendanceCount || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Section */}
      {showForm && isManager && (
        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">
              <CreditCard size={20} />
              Process New Payment
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Event</label>
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
                <label className="form-label">Staff Member</label>
                <select
                  value={formData.staff.id}
                  onChange={(e) => setFormData({...formData, staff: { id: e.target.value }})}
                  className="form-select"
                  required
                >
                  <option value="">Select Staff</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} - ${member.hourlyRate}/hr
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Hours Worked</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData({...formData, hoursWorked: e.target.value})}
                  className="form-input"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hourly Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                  className="form-input"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Amount</label>
                <input
                  type="text"
                  value={`$${(formData.hoursWorked * formData.hourlyRate).toFixed(2)}`}
                  className="form-input"
                  disabled
                />
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="form-select"
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="CHECK">Check</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="form-input"
                  placeholder="Payment notes..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Process Payment
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <div className="section-header">
          <h3 className="section-title">
            <Filter size={18} />
            Filters
          </h3>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="clear-filters">
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
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="payment-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Event</th>
              <th>Staff</th>
              <th>Hours</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
              <th>Status</th>
              {isManager && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={isManager ? 10 : 9}>
                  <div className="empty-state">
                    <CreditCard className="empty-icon" size={80} />
                    <h3 className="empty-title">No Payment Records Found</h3>
                    <p className="empty-description">
                      {hasActiveFilters 
                        ? 'Try adjusting your filters to see more results.' 
                        : 'Payment records will appear here once processed.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td className="transaction-id">{payment.transactionId}</td>
                  <td>{payment.event.title}</td>
                  <td>{payment.staff.name}</td>
                  <td>{payment.hoursWorked?.toFixed(2)}</td>
                  <td>${payment.hourlyRate?.toFixed(2)}</td>
                  <td className="amount-cell">${payment.amount?.toFixed(2)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                  {isManager && (
                    <td>
                      <div className="action-buttons">
                        {payment.status === 'PENDING' && (
                          <button 
                            onClick={() => handleStatusUpdate(payment.id, 'PROCESSING')}
                            className="btn-sm btn-warning"
                            disabled={actionLoading}
                          >
                            Process
                          </button>
                        )}
                        {payment.status === 'PROCESSING' && (
                          <button 
                            onClick={() => handleStatusUpdate(payment.id, 'COMPLETED')}
                            className="btn-sm btn-success"
                            disabled={actionLoading}
                          >
                            Complete
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

export default PaymentProcessor;