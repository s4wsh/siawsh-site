import React, { useRef } from 'react';

export default function ProjectCard({ title, category, imageSrc, previewVideoSrc, isVideo }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="project-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="media-wrapper">
        {isVideo ? (
          <video
            ref={videoRef}
            src={previewVideoSrc}
            poster={imageSrc}
            loop
            muted
            playsInline
            className="card-video"
          />
        ) : (
          <img src={imageSrc} alt={title} className="card-image" />
        )}
      </div>
      <div className="project-info">
        <h3>{title}</h3>
        <span>{category}</span>
      </div>
    </div>
  );
}