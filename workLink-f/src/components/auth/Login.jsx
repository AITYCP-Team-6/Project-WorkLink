// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid email or password. Please try again.');
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="38" fill="rgba(255,255,255,0.1)"/>
                <path d="M40 15 L50 25 L50 35 L40 45 L30 35 L30 25 Z" fill="white" opacity="0.9"/>
                <circle cx="40" cy="55" r="8" fill="white" opacity="0.9"/>
                <circle cx="25" cy="55" r="6" fill="white" opacity="0.7"/>
                <circle cx="55" cy="55" r="6" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <h1>WorkLink</h1>
            <p className="brand-tagline">Workforce Management Made Simple</p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Manage Events Efficiently</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Track Attendance</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Process Payments Seamlessly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-wrapper">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back!</h2>
              <p>Enter your credentials to access your account</p>
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

            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
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
                    className={`form-input ${emailTouched && !isValidEmail(formData.email) ? 'input-error' : ''} ${emailTouched && isValidEmail(formData.email) ? 'input-success' : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    onBlur={() => setEmailTouched(true)}
                    required
                    autoComplete="email"
                    style={{ paddingLeft: '40px' }}
                  />
                  {emailTouched && isValidEmail(formData.email) && (
                    <span className="input-validation-icon success">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </span>
                  )}
                </div>
                {emailTouched && formData.email && !isValidEmail(formData.email) && (
                  <span className="input-error-text">Please enter a valid email address</span>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`form-input ${passwordTouched && formData.password.length < 6 ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    onBlur={() => setPasswordTouched(true)}
                    required
                    autoComplete="current-password"
                    style={{ paddingLeft: '40px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                </div>
                {passwordTouched && formData.password.length > 0 && formData.password.length < 6 && (
                  <span className="input-error-text">Password must be at least 6 characters</span>
                )}
              </div>

              {/* Remember Me */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-text">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`btn-login ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Security Badge */}
            <div className="security-badge">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Your connection is secure and encrypted</span>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link">
              Don't have an account? 
              <Link to="/register" className="link-primary"> Create one now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;