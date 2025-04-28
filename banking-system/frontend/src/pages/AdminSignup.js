import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminSignup } from '../services/api';
import './loginStyles.css';

const AdminSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await adminSignup({ username, email, password });
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data.message || 'Signup failed');
    }
  };

  return (
    <div className="ring">
      <i style={{ "--clr": "#00ff0a" }}></i>
      <i style={{ "--clr": "#ff0057" }}></i>
      <i style={{ "--clr": "#fffd44" }}></i>
      <div className="login">
        <h2>Admin Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="inputBx">
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required />
          </div>
          <div className="inputBx">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required />
          </div>
          <div className="inputBx">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required />
          </div>
          <div className="inputBx">
            <input type="submit" value="Sign up" />
          </div>
          <div className="links">
            <Link to="/admin/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
