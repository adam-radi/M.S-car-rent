import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../api/authApi';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cin: '',
    licenseNumber: ''
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(formData);
      if (data.success) {
        login(data.user, data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2>Create an Account</h2>
        <p>Sign up to start renting cars</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First name" />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last name" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="Email address" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cin">CIN</label>
              <input type="text" id="cin" value={formData.cin} onChange={handleChange} placeholder="Identity number (Optional)" />
            </div>
            <div className="form-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input type="text" id="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="License number (Optional)" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm Password" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-redirect">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
