import React, { useState } from 'react';

export default function ShareButtons({ title, excerpt, isLight }) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = encodeURIComponent(title || '');
  const shareExcerpt = encodeURIComponent(excerpt || '');

  const shareLinks = [
    {
      name: 'X',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.2.19 2.2.19v2.42h-1.24c-1.23 0-1.61.76-1.61 1.54V12h2.72l-.43 3h-2.29v6.8c4.56-.93 8-4.96 8-9.8z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Email',
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      ),
      url: `mailto:?subject=${shareTitle}&body=${shareExcerpt}%20${encodeURIComponent(currentUrl)}`,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt,
        url: currentUrl,
      }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-13 py-5 my-0 text-xs">
      <span className="text-[12px] uppercase tracking-widest opacity-40 font-mono">
        SHARE ENTRY:
      </span>
      
      <div className="flex items-center gap-1.5">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${link.name}`}
            className={`flex items-center justify-center h-7 w-7 border transition-colors ${
              isLight
                ? 'border-black/20 hover:border-black hover:bg-black/5 text-black'
                : 'border-white/20 hover:border-white hover:bg-white/10 text-white'
            }`}
          >
            {link.icon}
          </a>
        ))}

        <button
          onClick={handleCopyLink}
          type="button"
          className={`flex items-center gap-1.5 h-7 px-2.5 border text-[10px] font-mono uppercase tracking-widest transition-colors ${
            isLight
              ? 'border-black/20 hover:border-black hover:bg-black/5 text-black'
              : 'border-white/20 hover:border-white hover:bg-white/10 text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          {copied ? 'COPIED!' : 'COPY LINK'}
        </button>

        {typeof navigator !== 'undefined' && navigator.share && (
          <button
            onClick={handleNativeShare}
            type="button"
            title="Share"
            className={`flex items-center justify-center h-7 w-7 border transition-colors ${
              isLight
                ? 'border-black/20 hover:border-black hover:bg-black/5 text-black'
                : 'border-white/20 hover:border-white hover:bg-white/10 text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}