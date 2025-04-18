import React from 'react';
import './App.css';
import Router from './Router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

export default App;