import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px'
          }}> 
            <h1>Banking Management</h1>
            <ul style={{
                listStyleType: 'none',
                display: 'flex',
                gap: '15px',
                paddingLeft: 0
            }}>
                <li><Link style={{color: '#fff', textDecoration: 'none'}} to="/">Dashboard</Link></li>
                <li><Link style={{color: '#fff', textDecoration: 'none'}} to="/customers">Customers</Link></li>
                <li><Link style={{color: '#fff', textDecoration: 'none'}} to="/accounts">Accounts</Link></li>
                <li><Link style={{color: '#fff', textDecoration: 'none'}} to="/transactions">Transactions</Link></li>
            </ul>
          </nav>
    );
};

export default Navbar;