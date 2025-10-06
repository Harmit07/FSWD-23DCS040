import React from 'react';
import './Sidebar.css';

function Sidebar({ isOpen, setIsOpen, setCurrentSection }) {
  const handleClick = (section) => {
    setCurrentSection(section);
    setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/charusat.jpeg" alt="Logo" />
          <span>CHARUSAT</span>
        </div>
        <button className="close-button" onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>
      <nav className="sidebar-links">
        <a onClick={() => handleClick('home')} tabIndex={0}>🏠 Home</a>
        <a onClick={() => handleClick('about')} tabIndex={0}>🎓 About</a>
        <a onClick={() => handleClick('services')} tabIndex={0}>🛠 Services</a>
        <a onClick={() => handleClick('contact')} tabIndex={0}>✉️ Contact</a>
      </nav>
      <div className="sidebar-footer">
        <span>© {new Date().getFullYear()} CHARUSAT</span>
      </div>
    </aside>
  );
}

export default Sidebar;