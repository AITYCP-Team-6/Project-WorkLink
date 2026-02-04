// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'STAFF',
    hourlyRate: 15
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
  };

  const validateName = (name) => {
  return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name.trim());
};

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: '#e53e3e' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: '#f59e0b' };
    if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 75, label: 'Good', color: '#3b82f6' };
    }
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 100, label: 'Strong', color: '#10b981' };
    }
    return { strength: 75, label: 'Medium', color: '#f59e0b' };
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (!validateName(value)) error = 'Please enter a valid name';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!validateEmail(value)) error = 'Please enter a valid email';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (value && !validatePhone(value)) error = 'Please enter a valid 10-digit phone number';
        break;
      case 'hourlyRate':
        if (value < 0) error = 'Rate must be positive';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setFieldErrors({ ...fieldErrors, [name]: error });
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      errors.name = validateField('name', formData.name);
      errors.email = validateField('email', formData.email);
    } else if (step === 2) {
      errors.password = validateField('password', formData.password);
      errors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }
    
    setFieldErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword' && key !== 'address') {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors before submitting');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="register-container">
      {/* Background Animation */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="register-content">
        {/* Header with Logo */}
        <div className="register-header-top">
          <div className="brand-logo-small">
            <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
              <path d="M40 15 L50 25 L50 35 L40 45 L30 35 L30 25 Z" fill="#667eea"/>
              <circle cx="40" cy="55" r="8" fill="#667eea"/>
            </svg>
          </div>
          <h2 className="brand-name">WorkLink</h2>
        </div>

        <div className="register-card">
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > 1 ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : '1'}
              </div>
              <span className="step-label">Basic Info</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">
                {currentStep > 2 ? (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : '2'}
              </div>
              <span className="step-label">Security</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Details</span>
            </div>
          </div>

          <div className="register-header">
            <h2>Create Your Account</h2>
            <p>Join WorkLink and start managing your workforce today</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${fieldErrors.name ? 'input-error' : ''} ${touched.name && !fieldErrors.name && formData.name ? 'input-success' : ''}`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    {touched.name && !fieldErrors.name && formData.name && (
                      <span className="input-validation-icon success">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {fieldErrors.name && <span className="input-error-text">{fieldErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${fieldErrors.email ? 'input-error' : ''} ${touched.email && !fieldErrors.email && formData.email ? 'input-success' : ''}`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    {touched.email && !fieldErrors.email && formData.email && (
                      <span className="input-validation-icon success">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {fieldErrors.email && <span className="input-error-text">{fieldErrors.email}</span>}
                </div>

                <button type="button" onClick={nextStep} className="btn-next">
                  Continue
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Step 2: Password Setup */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && <span className="input-error-text">{fieldErrors.password}</span>}
                  
                  {formData.password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill" 
                          style={{ width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }}
                        ></div>
                      </div>
                      <span className="strength-label" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                  <p className="input-hint">Use at least 6 characters with a mix of letters, numbers & symbols</p>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : ''} ${touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword ? 'input-success' : ''}`}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      required
                      style={{ paddingLeft: '40px' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                    {touched.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword && (
                      <span className="input-validation-icon success">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  {fieldErrors.confirmPassword && <span className="input-error-text">{fieldErrors.confirmPassword}</span>}
                </div>

                <div className="form-step-buttons">
                  <button type="button" onClick={prevStep} className="btn-back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                    </svg>
                    Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-next">
                    Continue
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-input ${fieldErrors.phone ? 'input-error' : ''}`}
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      onBlur={() => handleBlur('phone')}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  {fieldErrors.phone && <span className="input-error-text">{fieldErrors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="form-input"
                      placeholder="Enter your address (optional)"
                      value={formData.address}
                      onChange={handleChange}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>

                <div className={`form-row ${formData.role !== 'STAFF' ? 'form-row-single' : ''}`}>
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">
                      Role <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                        </svg>
                      </span>
                      <select
                        id="role"
                        name="role"
                        className="form-input"
                        value={formData.role}
                        onChange={(e) => {
                          handleChange(e);
                          // Reset hourlyRate to default when switching back to STAFF
                          if (e.target.value === 'STAFF') {
                            setFormData(prev => ({ ...prev, role: e.target.value, hourlyRate: 15 }));
                          }
                        }}
                        style={{ paddingLeft: '40px' }}
                      >
                        <option value="STAFF">Staff/Volunteer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                  </div>

                  {/* Hourly Rate — only visible for Staff/Volunteer */}
                  {formData.role === 'STAFF' && (
                    <div className="form-group">
                      <label htmlFor="hourlyRate" className="form-label">
                        Hourly Rate (₹)
                      </label>
                      <div className="input-wrapper">
                        <span className="input-icon">₹</span>
                        <input
                          type="number"
                          id="hourlyRate"
                          name="hourlyRate"
                          className="form-input"
                          placeholder="15"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          min="0"
                          step="0.5"
                          style={{ paddingLeft: '40px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="terms-agreement">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" required />
                    <span className="checkbox-text">
                      I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="form-step-buttons">
                  <button type="button" onClick={prevStep} className="btn-back">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                    </svg>
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={`btn-submit ${loading ? 'btn-loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Security Badge */}
          <div className="security-badge">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>Your information is secure and encrypted</span>
          </div>

          {/* Login Link */}
          <div className="login-link">
            Already have an account? 
            <Link to="/login" className="link-primary"> Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;