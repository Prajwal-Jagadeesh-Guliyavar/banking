import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      Banking System
    </footer>
  );
};

const footerStyle = {
  textAlign: 'center',
  padding: '15px 0',
  backgroundColor: 'rgba(51, 51, 51, 0.28)',
  color: '#fff',
  fontSize: '16px',
  position: 'fixed',
  width: '50%',
  bottom: 0,
};

export default Footer;
