import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">
          <h1>MediSync</h1>
        </div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="nav-btn reg" onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="brand">MediSync</span></h1>
          <p>Your integrated healthcare management solution</p>
        </div>
      </div>

      <div className="content">
        <h2>Manage Your Healthcare with Ease</h2>
        <p>
          MediSync helps doctors and pharmacists manage prescriptions, patient information, and streamline communication.
          Stay connected and improve healthcare management today!
        </p>
      </div>
      
      <div className="features">
        <h2>Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Prescription Management</h3>
            <p>Easily manage and track prescriptions for patients.</p>
          </div>
          <div className="feature-card">
            <h3>Patient Information</h3>
            <p>Access comprehensive patient details and medical history.</p>
          </div>
          <div className="feature-card">
            <h3>Communication</h3>
            <p>Seamlessly communicate between doctors and pharmacists.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
