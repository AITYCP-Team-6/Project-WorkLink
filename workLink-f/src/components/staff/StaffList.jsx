import React, { useState, useEffect } from 'react';
import { 
  Users, Filter, X, Search, Mail, Phone, MapPin, 
  DollarSign, Award, CheckCircle, XCircle, TrendingUp,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './StaffList.css';

const StaffList = () => {
  const { isManager } = useAuth();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [filters, setFilters] = useState({ role: '', availability: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [staff, filters]);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/staff');
      setStaff(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...staff];
    
    if (filters.role) {
      filtered = filtered.filter(s => s.role === filters.role);
    }
    
    if (filters.availability !== '') {
      const isAvailable = filters.availability === 'true';
      filtered = filtered.filter(s => s.availability === isAvailable);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        (s.phone && s.phone.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredStaff(filtered);
  };

  const handleToggleAvailability = async (staffId, currentAvailability) => {
    if (!isManager) return;
    
    setActionLoading(true);
    try {
      const staffMember = staff.find(s => s.id === staffId);
      await api.put(`/staff/${staffId}`, {
        ...staffMember,
        availability: !currentAvailability
      });
      await fetchStaff();
      alert('Availability updated successfully!');
    } catch (error) {
      alert('Error updating availability');
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ role: '', availability: '', search: '' });
  };

  const hasActiveFilters = filters.role || filters.availability || filters.search;

  const calculateStats = () => {
    const available = staff.filter(s => s.availability).length;
    const unavailable = staff.length - available;
    const avgRate = staff.length > 0 
      ? (staff.reduce((sum, s) => sum + (s.hourlyRate || 0), 0) / staff.length).toFixed(2)
      : '0.00';
    
    return { available, unavailable, avgRate };
  };

  if (loading) {
    return (
      <div className="staff-loading">
        <div className="loading-spinner"></div>
        <p>Loading staff members...</p>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="staff-list-container">
      {/* Page Header */}
      <div className="staff-page-header">
        <h1 className="staff-page-title">
          <Users size={32} />
          Staff Members
          <span className="staff-count-badge">{staff.length}</span>
        </h1>
      </div>

      {/* Statistics Section */}
      <div className="staff-stats-section">
        <h2 className="stats-header">
          <TrendingUp size={20} />
          Staff Statistics
        </h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">
              <Users size={14} />
              Total Staff
            </div>
            <div className="stat-value">{staff.length}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <CheckCircle size={14} />
              Available
            </div>
            <div className="stat-value">{stats.available}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <XCircle size={14} />
              Unavailable
            </div>
            <div className="stat-value">{stats.unavailable}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <IndianRupee size={14} />
              Average Rate
            </div>
            <div className="stat-value">${stats.avgRate}/hr</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="staff-filters-section">
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
                placeholder="Search by name, email, phone..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <Briefcase size={14} />
              Role
            </label>
            <select 
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="filter-select"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <CheckCircle size={14} />
              Availability
            </label>
            <select 
              value={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.value})}
              className="filter-select"
            >
              <option value="">All Availability</option>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="empty-state">
          <Users className="empty-icon" size={120} />
          <h2 className="empty-title">
            {hasActiveFilters ? 'No staff match your filters' : 'No staff members found'}
          </h2>
          <p className="empty-description">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results.' 
              : 'Staff members will appear here once added to the system.'}
          </p>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters} 
              className="btn-toggle unavailable"
              style={{ marginTop: '20px', display: 'inline-flex' }}
            >
              <X size={18} />
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="staff-grid">
          {filteredStaff.map(member => (
            <div key={member.id} className="staff-card">
              {/* Card Header */}
              <div className="staff-card-header">
                <div className="staff-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="staff-header-info">
                  <h3 className="staff-name">{member.name}</h3>
                  <span className="staff-role-badge">
                    <Briefcase size={12} />
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="staff-card-body">
                <div className="staff-info-item">
                  <div className="info-icon">
                    <Mail size={16} />
                  </div>
                  <span className="info-text">{member.email}</span>
                </div>

                {member.phone && (
                  <div className="staff-info-item">
                    <div className="info-icon">
                      <Phone size={16} />
                    </div>
                    <span className="info-text">{member.phone}</span>
                  </div>
                )}

                {member.address && (
                  <div className="staff-info-item">
                    <div className="info-icon">
                      <MapPin size={16} />
                    </div>
                    <span className="info-text">{member.address}</span>
                  </div>
                )}

                <div className="staff-rate">
                  <span className="rate-label">Hourly Rate</span>
                  <span className="rate-value">
                    ${member.hourlyRate?.toFixed(2) || '0.00'}/hr
                  </span>
                </div>

                <div className={`availability-status ${member.availability ? 'available' : 'unavailable'}`}>
                  <span className="availability-dot"></span>
                  {member.availability ? (
                    <>
                      <CheckCircle size={16} />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Unavailable
                    </>
                  )}
                </div>

                {member.skills && member.skills.length > 0 && (
                  <div className="staff-skills">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">
                        <Award size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              {isManager && (
                <div className="staff-card-actions">
                  <button 
                    onClick={() => handleToggleAvailability(member.id, member.availability)}
                    className={`btn-toggle ${member.availability ? 'available' : 'unavailable'}`}
                    disabled={actionLoading}
                  >
                    {member.availability ? (
                      <>
                        <XCircle size={16} />
                        Mark Unavailable
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Mark Available
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffList;