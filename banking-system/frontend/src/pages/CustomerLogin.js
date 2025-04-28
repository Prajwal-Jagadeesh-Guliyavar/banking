import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './loginStyles.css';

const CustomerLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid credentials');
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
        <h2>Customer Login</h2>
        {error && <div className="error-message" style={{ color: '#ff0057', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="inputBx">
            <input 
              type="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="inputBx">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="inputBx">
            <input 
              type="submit" 
              value={isLoading ? 'Logging in...' : 'Sign In'} 
              disabled={isLoading}
            />
          </div>
          
          <div className="links">
            <Link to="/signup">Sign Up</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;