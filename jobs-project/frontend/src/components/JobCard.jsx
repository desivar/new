// src/components/JobCard.jsx
import React from 'react';
import './JobCard.css'; // This refers to the CSS file in the same directory

function JobCard({ title, value }) {
  return (
    <div className="job-card">
      <div className="card-content">
        <h4 className="card-title">{title}</h4>
        <div className="card-value">${value.toLocaleString()}</div> {/* Format value */}
        {/* You can add more details here later, like dates, people, etc. */}
      </div>
      <div className="card-icons">
        {/* Placeholder for icons like person, paperclip, calendar */}
        <span className="icon">👤</span> {/* Person icon */}
        <span className="icon">📎</span> {/* Paperclip icon */}
      </div>
    </div>
  );
}

export default JobCard;