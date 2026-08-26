import React, { useState } from 'react';

export default function ShareButtons({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/insights/${slug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    x: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="flex items-center gap-6 py-8 border-y border-neutral-800/20 my-12">
      <span className="text-xs uppercase tracking-widest opacity-50">Share Article</span>
      
      <div className="flex items-center gap-4 text-xs tracking-widest uppercase">
        <a 
          href={shareLinks.x} 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          X (Twitter)
        </a>
        <a 
          href={shareLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-60 hover:opacity-100 transition-opacity"
        >
          LinkedIn
        </a>
        <button 
          type="button" 
          onClick={handleCopy}
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          {copied ? 'Copied Link' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}