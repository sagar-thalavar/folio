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
        <div className="splash-title-container">
          <h1 className="splash-name">SAGAR</h1>
          <div className="splash-underline"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashOverlay;
