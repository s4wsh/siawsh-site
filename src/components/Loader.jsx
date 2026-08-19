import React, { useState, useEffect, useRef } from 'react';
import './Loader.css';

export default function Loader({ onFinish }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);

  const handleComplete = () => {
    if (isFading) return;
    setIsFading(true);

    setTimeout(() => {
      if (onFinish) onFinish();
    }, 600);
  };

  useEffect(() => {
    // Attempt programmatic playback to bypass strict browser restrictions
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay prevented or failed:", err);
        handleComplete();
      });
    }

    // Safety fallback: guaranteed exit after 3.5 seconds
    const fallbackTimer = setTimeout(() => {
      handleComplete();
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <div className={`loader-overlay ${isFading ? 'fade-out' : ''}`}>
      <div className="loader-logo-container">
        <video
          ref={videoRef}
          src="/logo-motion.webm"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleComplete}
          onError={(e) => {
            console.error("Video asset failed to load:", e);
            handleComplete();
          }}
          className="loader-logo-video"
        />
      </div>
    </div>
  );
}
