import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-body">
          {project.isVideo ? (
            <video 
              src={project.previewVideoSrc} 
              controls 
              autoPlay 
              className="modal-media" 
            />
          ) : (
            <img 
              src={project.imageSrc} 
              alt={project.title} 
              className="modal-media" 
            />
          )}

          <div style={{ marginTop: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {project.category}
            </span>
            <h2 style={{ margin: '8px 0 12px 0', fontSize: '1.8rem' }}>{project.title}</h2>
            <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
              A signature {project.category.toLowerCase()} project engineered by SIAWSH. Tailored with modern aesthetics, precision materials, and spatial harmony.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}