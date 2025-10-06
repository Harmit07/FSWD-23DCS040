import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch (currentSection) {
      case 'about':
        return (
          <div className="about-section">
            <div className="about-header">
              <img
                src="/charusat.jpeg"
                alt="Charusat Logo"
                className="charusat-logo"
              />
              <div>
                <h2>Charotar University of Science & Technology (CHARUSAT)</h2>
                <p className="tagline">Empowering through knowledge and innovation.</p>
              </div>
            </div>
            <div className="about-content">
              <p>
                CHARUSAT is a NAAC A+ accredited private university in Gujarat, India. 
                It offers world-class education in engineering, pharmacy, computer science, 
                management, and more. With a focus on research, innovation, and community values, 
                CHARUSAT prepares students to excel in a fast-changing world.
              </p>
              <p>
                The university hosts state-of-the-art labs, strong industry collaborations, 
                incubation centers, and vibrant student life — all designed to foster 
                holistic development and real-world impact.
              </p>
            </div>
            <div className="about-footer">
              <a
                href="https://www.charusat.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                Visit Official Website →
              </a>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="section">
            <h2>Our Services</h2>
            <div className="services-list">
              <div className="service-card">
                <span role="img" aria-label="Engineering">🛠️</span>
                <h4>Engineering Programs</h4>
                <p>Cutting-edge B.Tech, M.Tech, and research opportunities.</p>
              </div>
              <div className="service-card">
                <span role="img" aria-label="Pharmacy">💊</span>
                <h4>Pharmacy</h4>
                <p>Modern labs and industry-oriented curriculum.</p>
              </div>
              <div className="service-card">
                <span role="img" aria-label="Management">📈</span>
                <h4>Management</h4>
                <p>Business, entrepreneurship, and leadership programs.</p>
              </div>
              <div className="service-card">
                <span role="img" aria-label="Research">🔬</span>
                <h4>Research & Innovation</h4>
                <p>Incubation, patents, and real-world impact projects.</p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="section">
            <h2>Contact Us</h2>
            <div className="contact-card">
              <p>
                <strong>Email:</strong> <a href="mailto:info@charusat.edu.in">info@charusat.edu.in</a>
              </p>
              <p>
                <strong>Phone:</strong> <a href="tel:+912692226232">+91 2692 226232</a>
              </p>
              <p>
                <strong>Address:</strong> CHARUSAT Campus, Changa, Gujarat, India
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="home-section">
            <div className="hero-banner">
              <h1>WELCOME TO CHARUSAT</h1>
              <p>CHOOSE CHARUSAT, CHOOSE SUCCESS!</p>
              <a href="https://charusat.ac.in" target="_blank" rel="noopener noreferrer" className="cta-button">
                Explore More →
              </a>
            </div>
            <div className="features">
              <div className="feature-card">
                <h3>Top-Tier Academics</h3>
                <p>Offering engineering, science, management, and more with a strong focus on quality education.</p>
              </div>
              <div className="feature-card">
                <h3>Research Driven</h3>
                <p>We encourage innovation through cutting-edge labs and real-world projects.</p>
              </div>
              <div className="feature-card">
                <h3>Industry Ready</h3>
                <p>Our curriculum is designed with industry input to ensure career success.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        setCurrentSection={setCurrentSection}
      />
      <div className={`main-content ${isSidebarOpen ? 'collapsed' : ''}`}>
        <button
          className="toggle-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Open sidebar"
        >
          <span className="toggle-icon">☰</span>
        </button>
        {renderSection()}
      </div>
    </div>
  );
}

export default App;