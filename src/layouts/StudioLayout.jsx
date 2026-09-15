import React from 'react';
import { Outlet } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import GatewayWebGLBackground from '../components/GatewayWebGLBackground.jsx';

export default function StudioLayout() {
  const { mode, lang } = useStudioTheme();
  const isPersian = lang === 'fa';

  const fontStyle = {
    fontFamily: isPersian
      ? 'Vazirmatn, var(--font-sans), system-ui, sans-serif'
      : 'var(--font-sans), system-ui, sans-serif',
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200"
      style={fontStyle}
      dir={isPersian ? 'rtl' : 'ltr'}
    >
      {/* Dynamic Background Shader at lower opacity for content readability */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-1000">
        <GatewayWebGLBackground activeDiscipline={mode} />
      </div>

      {/* Mode-Specific Radial Glow Overlay */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${
          mode === 'spatial'
            ? 'opacity-30 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-transparent'
            : 'opacity-30 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-transparent'
        }`}
      />

      {/* Global Grain/Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-50 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Page Content Stream */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}