import React from 'react';

const headlines = [
  "CSV Analyzer & Interactive Python Dashboard",
  "Stripe Payment Gateway Integration",
  "BIC Venue: Constructing Personal Archives Exhibition",
  "Mobile Detox Screen Time Blocker Spike"
];

const Upcoming: React.FC = () => {
  const doubleHeadlines = [...headlines, ...headlines];

  return (
    <div className="news-ticker glass">
      <div className="ticker-badge">
        <span>ROADMAP</span>
      </div>
      <div className="ticker-content">
        <div className="ticker-track">
          {doubleHeadlines.map((text, idx) => (
            <span key={idx} className="ticker-item">
              <span className="ticker-text">{text}</span>
              <span className="ticker-divider">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
