import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { customerSignup } from '../services/api';
import './loginStyles.css';

const CustomerSignup = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await customerSignup({ fname, lname, email, password });
      navigate('/login');
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
        <h2>Customer Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="inputBx">
            <input 
              type="text" 
              placeholder="First Name" 
              value={fname}
              onChange={e => setFname(e.target.value)}
              required />
          </div>
          <div className="inputBx">
            <input 
              type="text" 
              placeholder="Last Name" 
              value={lname}
              onChange={e => setLname(e.target.value)}
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
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignup;
