import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../services/api';
import './loginStyles.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await adminLogin({ email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    }
  };

  return (
    <div className="ring">
      <i style={{ "--clr": "#00ff0a" }}></i>
      <i style={{ "--clr": "#ff0057" }}></i>
      <i style={{ "--clr": "#fffd44" }}></i>
      <div className="login">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
            <input type="submit" value="Sign in" />
          </div>
          <div className="links">
            <Link to="/admin/signup">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
