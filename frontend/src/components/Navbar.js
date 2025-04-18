import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="bank-logo">🏦</span>
        <h1 className="bank-title">Premier Banking</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/" className="nav-link">Dashboard</Link></li>
        <li><Link to="/customers" className="nav-link">Clients</Link></li>
        <li><Link to="/accounts" className="nav-link">Accounts</Link></li>
        <li><Link to="/transactions" className="nav-link">Transactions</Link></li>
      </ul>
      <div className="nav-user">
        <span className="user-avatar">👤</span>
        <span className="user-name">Admin</span>
      </div>
    </nav>
  );
};

export default Navbar;