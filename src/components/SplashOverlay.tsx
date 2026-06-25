import React, { useEffect, useState } from 'react';

interface SplashOverlayProps {
  onComplete: () => void;
}

const SplashOverlay: React.FC<SplashOverlayProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. Hold splash screen for 1.6s of logo drawing and text fade
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 1600);

    // 2. Complete splash and remove from DOM after exit transition (600ms)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-overlay ${isExiting ? 'splash-exit' : ''}`} aria-hidden="true">
      <div className="splash-content">
        {/* Sleek SVG Tracing Logo (Circle is gone!) */}
        <div className="splash-logo-container">
          <svg className="splash-svg" viewBox="0 0 100 100" width="100" height="100">
            {/* Sleek Inner Initials SRT/Waves design */}
            <path
              className="splash-path"
              d="M 32,48 C 38,35 44,65 50,50 C 56,35 62,65 68,52"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Animated letter-spacing Title */}
        <div className="splash-title-container">
          <h2 className="splash-title">SAGAR R. THALAVAR</h2>
          <div className="splash-progressbar">
            <div className="splash-progressbar-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashOverlay;
