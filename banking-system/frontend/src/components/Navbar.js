import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="bank-logo">🏦</span>
        <h1 className="bank-title">Premier Banking</h1>
      </div>
      
      {user && (
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Dashboard</Link></li>
          <li><Link to="/customers" className="nav-link">Clients</Link></li>
          <li><Link to="/accounts" className="nav-link">Accounts</Link></li>
          <li><Link to="/transactions" className="nav-link">Transactions</Link></li>
        </ul>
      )}

      <div className="nav-user">
        {user ? (
          <>
            <span className="user-avatar">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;