import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, IndianRupee, Tag, Clock, AlertCircle, ArrowLeft, Save, X } from 'lucide-react';
import api from '../../services/api';
import './EventForm.css';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    requiredStaff: 1,
    category: 'EXAM',
    budget: 0,
    status: 'UPCOMING'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/${id}`);
      const event = response.data.data;
      
      const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };
      
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: formatDateTime(event.startDate),
        endDate: formatDateTime(event.endDate),
        requiredStaff: event.requiredStaff,
        category: event.category,
        budget: event.budget,
        status: event.status
      });
      setLoading(false);
    } catch (error) {
      setError('Error loading event. Please try again.');
      setLoading(false);
      console.error('Error fetching event:', error);
    }
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors.title = 'Title is required';
        } else if (value.length < 3) {
          errors.title = 'Title must be at least 3 characters';
        } else if (value.length > 100) {
          errors.title = 'Title must be less than 100 characters';
        } else {
          delete errors.title;
        }
        break;

      case 'description':
        if (!value.trim()) {
          errors.description = 'Description is required';
        } else if (value.length < 10) {
          errors.description = 'Description must be at least 10 characters';
        } else {
          delete errors.description;
        }
        break;

      case 'location':
        if (!value.trim()) {
          errors.location = 'Location is required';
        } else {
          delete errors.location;
        }
        break;

      case 'startDate':
        if (!value) {
          errors.startDate = 'Start date is required';
        } else if (new Date(value) < new Date()) {
          errors.startDate = 'Start date cannot be in the past';
        } else {
          delete errors.startDate;
        }
        break;

      case 'endDate':
        if (!value) {
          errors.endDate = 'End date is required';
        } else if (formData.startDate && new Date(value) <= new Date(formData.startDate)) {
          errors.endDate = 'End date must be after start date';
        } else {
          delete errors.endDate;
        }
        break;

      case 'requiredStaff':
        if (!value || value < 1) {
          errors.requiredStaff = 'At least 1 staff member is required';
        } else if (value > 1000) {
          errors.requiredStaff = 'Cannot exceed 1000 staff members';
        } else {
          delete errors.requiredStaff;
        }
        break;

      case 'budget':
        if (value < 0) {
          errors.budget = 'Budget cannot be negative';
        } else {
          delete errors.budget;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'requiredStaff' || name === 'budget' ? parseFloat(value) || 0 : value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });

    if (touched[name]) {
      validateField(name, processedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/events/${id}`, formData);
      } else {
        await api.post('/events', formData);
        alert('Event created successfully! You can now post it to make it visible to volunteers.');
      }
      navigate('/events');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving event. Please try again.');
      setLoading(false);
    }
  };

  const categories = [
   { value: 'EXAM', label: 'EXAM', icon: '🎓' },
    { value: 'WORKSHOP', label: 'Workshop', icon: '🛠️' },
    { value: 'COMMUNITY', label: 'Community', icon: '🤝' },
    { value: 'SPORTS', label: 'Sports', icon: '⚽' },
    { value: 'CHARITY', label: 'Charity', icon: '❤️' },
    { value: 'OTHER', label: 'Other', icon: '📌' }
  ];

  const statuses = [
    { value: 'UPCOMING', label: 'Upcoming', color: 'blue' },
    { value: 'ONGOING', label: 'Ongoing', color: 'yellow' },
    { value: 'COMPLETED', label: 'Completed', color: 'green' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' }
  ];

  if (loading && isEdit) {
    return (
      <div className="event-form-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="event-form-container">
      {/* Header */}
      <div className="event-form-header">
        <div className="header-content">
          <Link to="/events" className="back-button">
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </Link>
          <h1>{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
          <p className="header-subtitle">
            {isEdit ? 'Update your event information' : 'Fill in the details to create a new event'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError('')} className="alert-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="event-form-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>Basic Information</h2>
              <p>Essential details about your event</p>
            </div>

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <Calendar size={16} />
                Event Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter event title"
                className={`form-input ${touched.title && validationErrors.title ? 'input-error' : ''}`}
              />
              {touched.title && validationErrors.title && (
                <span className="error-message">{validationErrors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your event in detail"
                rows="4"
                className={`form-textarea ${touched.description && validationErrors.description ? 'input-error' : ''}`}
              />
              {touched.description && validationErrors.description && (
                <span className="error-message">{validationErrors.description}</span>
              )}
              <span className="input-hint">{formData.description.length} characters</span>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                <MapPin size={16} />
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter event location"
                className={`form-input ${touched.location && validationErrors.location ? 'input-error' : ''}`}
              />
              {touched.location && validationErrors.location && (
                <span className="error-message">{validationErrors.location}</span>
              )}
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>Date & Time</h2>
              <p>When will your event take place?</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  <Clock size={16} />
                  Start Date & Time <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.startDate && validationErrors.startDate ? 'input-error' : ''}`}
                />
                {touched.startDate && validationErrors.startDate && (
                  <span className="error-message">{validationErrors.startDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  <Clock size={16} />
                  End Date & Time <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.endDate && validationErrors.endDate ? 'input-error' : ''}`}
                />
                {touched.endDate && validationErrors.endDate && (
                  <span className="error-message">{validationErrors.endDate}</span>
                )}
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>Event Details</h2>
              <p>Category, staffing, and budget information</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  <Tag size={16} />
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="requiredStaff" className="form-label">
                  <Users size={16} />
                  Required Staff <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="requiredStaff"
                  name="requiredStaff"
                  value={formData.requiredStaff}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1"
                  placeholder="Number of staff needed"
                  className={`form-input ${touched.requiredStaff && validationErrors.requiredStaff ? 'input-error' : ''}`}
                />
                {touched.requiredStaff && validationErrors.requiredStaff && (
                  <span className="error-message">{validationErrors.requiredStaff}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget" className="form-label">
                  <IndianRupee size={16} />
                  Budget (₹)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`form-input ${touched.budget && validationErrors.budget ? 'input-error' : ''}`}
                />
                {touched.budget && validationErrors.budget && (
                  <span className="error-message">{validationErrors.budget}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn-secondary"
              disabled={loading}
            >
              <X size={20} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || Object.keys(validationErrors).length > 0}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{isEdit ? 'Update Event' : 'Create Event'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;