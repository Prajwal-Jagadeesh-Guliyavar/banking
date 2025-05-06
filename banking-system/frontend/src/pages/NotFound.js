import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontFamily: 'Montserrat, sans-serif',
    textAlign: 'center',
    /*background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',*/
  },
  /*image: {
    width: '180px',
    height: '180px',
    objectFit: 'contain',
    marginBottom: '2rem',
    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.15))',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '50%',
    padding: '1rem',
  },*/
  heading: {
    fontSize: '4rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  paragraph: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  link: {
    padding: '0.75rem 2rem',
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid #fff',
    borderRadius: '30px',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  linkHover: {
    background: 'rgba(255,255,255,0.3)',
    color: '#764ba2',
    borderColor: '#764ba2',
  },
};

class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    return (
      <div style={styles.container}>
        <img
          src="/unplugit.png"
          alt="Error"
          style={styles.image}
        />
        <h1 style={styles.heading}>404 - Page Not Found</h1>
        <p style={styles.paragraph}>The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...(this.state.hover ? styles.linkHover : {}),
          }}
          onMouseEnter={() => this.setState({ hover: true })}
          onMouseLeave={() => this.setState({ hover: false })}
        >
          Return to Home
        </Link>
      </div>
    );
  }
}

export default NotFound;
