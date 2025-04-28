import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerSignup } from '../services/api';
import './loginStyles.css';

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone_no: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await customerSignup(formData);
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Signup failed';
      const missingFields = err.response?.data?.missing || [];
      
      if (missingFields.length > 0) {
        setError(`Missing fields: ${missingFields.join(', ')}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ring">
      <i style={{ "--clr": "#00ff0a" }}></i>
      <i style={{ "--clr": "#ff0057" }}></i>
      <i style={{ "--clr": "#fffd44" }}></i>
      
      <div className="login">
        <h2>Customer Signup</h2>
        {error && <div className="error-message" style={{ color: '#ff0057', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="inputBx">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              value={formData.fname}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="inputBx">
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              value={formData.lname}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="inputBx">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="inputBx">
            <input
              type="tel"
              name="phone_no"
              placeholder="Phone Number"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="inputBx">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="inputBx">
            <input 
              type="submit" 
              value={isLoading ? 'Creating Account...' : 'Sign Up'} 
              disabled={isLoading}
            />
          </div>
          
          <div className="links">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignup;