import React, { useState, useEffect } from 'react';
import './Loader.css';

export default function Loader({ onFinish }) {
  const [isFading, setIsFading] = useState(false);

  const handleComplete = () => {
    if (isFading) return;
    setIsFading(true);

    setTimeout(() => {
      if (onFinish) onFinish();
    }, 600);
  };

  useEffect(() => {
    // Safety fallback: 3.5s max in case video fails or gets blocked
    const fallbackTimer = setTimeout(() => {
      handleComplete();
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className={`loader-overlay ${isFading ? 'fade-out' : ''}`}>
      <div className="loader-logo-container">
        <video
          src="/logo-motion.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleComplete}
          onError={(e) => {
            console.error("Video failed to load:", e);
            handleComplete();
          }}
          className="loader-logo-video"
        />
      </div>
    </div>
  );
}