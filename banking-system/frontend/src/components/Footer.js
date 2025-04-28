import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-container">
      Banking Management System © {new Date().getFullYear()}
    </div>
  );
};

export default Footer;