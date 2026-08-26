import React, { useState, useEffect } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ContactForm() {
  const { mode, t, isLight } = useStudioTheme();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('arch');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [detectedTag, setDetectedTag] = useState(null);

  const disciplines = [
    { id: 'arch', label: t.contact?.disciplines?.arch || 'Architecture', keywords: ['arch', 'building', 'facade', 'structure', 'site', 'house', 'cad', 'spatial'] },
    { id: 'interior', label: t.contact?.disciplines?.interior || 'Interior', keywords: ['interior', 'room', 'clinic', 'office', 'salon', 'layout', 'mural'] },
    { id: 'furniture', label: t.contact?.disciplines?.furniture || 'Furniture', keywords: ['furniture', 'chair', 'table', 'wood', 'product', 'industrial', 'object'] },
    { id: 'motion', label: t.contact?.disciplines?.motion || 'Motion Design', keywords: ['motion', 'cgi', '3d', 'animation', 'render', 'video', 'blender', 'after effects', 'loop'] },
    { id: 'branding', label: t.contact?.disciplines?.branding || 'Branding', keywords: ['brand', 'identity', 'logo', 'typography', 'kinetic', 'deck', 'guidelines'] }
  ];

  // AI-like Auto-Detection based on message input
  useEffect(() => {
    const text = formData.message.toLowerCase();
    if (!text || text.length < 5) {
      setDetectedTag(null);
      return;
    }

    for (const item of disciplines) {
      if (item.keywords.some((kw) => text.includes(kw))) {
        setDetectedTag(item.id);
        break;
      }
    }
  }, [formData.message]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyDetected = (id) => {
    setSelectedDiscipline(id);
    setDetectedTag(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("access_key", "f5778241-8463-452c-8e63-489e789530b3");
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("message", formData.message);
    submitData.append(
      "selected_discipline",
      disciplines.find((item) => item.id === selectedDiscipline)?.label || ''
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert(t.contact?.submitError || 'Submission failed. Please try again.');
      }
    } catch (error) {
      alert(t.contact?.connectionError || 'Connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section py-8 md:py-12 relative overflow-hidden" id="contact">
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full">
        
        {/* Container Header with Status Telemetry */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-white/10 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00f0ff]">
                SYSTEM.INTERFACE // TRANSMISSION PROTOCOL
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">{t.contact?.title || 'Start a Project'}</h2>
          </div>
          <p className="text-xs font-mono opacity-50 uppercase tracking-widest">
            {mode === 'spatial' ? '[ SPATIAL ARCHITECTURE ]' : '[ CINEMATIC & MOTION ]'}
          </p>
        </div>

        {submitted ? (
          /* Futuristic Success Screen */
          <div className={`p-8 border rounded-none relative overflow-hidden ${
            isLight ? 'border-black/20 bg-black/5' : 'border-[#00f0ff]/30 bg-[#00f0ff]/5'
          }`}>
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#00f0ff] tracking-widest uppercase block">
                [ TRANSMISSION_SUCCESSFUL ]
              </span>
              <h3 className="text-2xl font-light tracking-tight">
                {t.contact?.successTitle || 'Inquiry Encrypted & Dispatched'}
              </h3>
              <p className="text-sm opacity-70 max-w-xl leading-relaxed">
                {t.contact?.successDesc || 'Thank you for initiating contact. Your project specs have been logged and routed directly to the studio lead. Expect a direct response within 24 hours.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className={`mt-4 px-6 py-2.5 text-xs font-mono uppercase tracking-wider border rounded-none transition-all duration-300 ${
                  isLight
                    ? 'border-black bg-black text-white hover:bg-transparent hover:text-black'
                    : 'border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black'
                }`}
              >
                Send Another Transmission →
              </button>
            </div>
          </div>
        ) : (
          <form className="contact-form space-y-5" onSubmit={handleSubmit}>
            
            {/* Discipline Selector */}
            <div className="discipline-selector space-y-2">
              <div className="flex items-center justify-between">
                <label className="field-label text-[11px] font-mono uppercase tracking-widest opacity-60">
                  {t.contact?.disciplineLabel || 'Select Primary Discipline'}
                </label>
                {detectedTag && detectedTag !== selectedDiscipline && (
                  <button
                    type="button"
                    onClick={() => handleApplyDetected(detectedTag)}
                    className="text-[10px] font-mono text-[#00f0ff] underline hover:opacity-80 transition-opacity uppercase tracking-wider"
                  >
                    ✦ Auto-detected: Switch to {disciplines.find(d => d.id === detectedTag)?.label}?
                  </button>
                )}
              </div>

              <div className="discipline-grid flex flex-wrap gap-2">
                {disciplines.map((item) => {
                  const isActive = selectedDiscipline === item.id;
                  const isSuggested = detectedTag === item.id && !isActive;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`relative px-4 py-2.5 text-xs uppercase tracking-wider font-mono border rounded-none transition-all duration-300 ${
                        isActive
                          ? isLight
                            ? 'bg-black text-white border-black shadow-md'
                            : 'bg-white text-black border-white shadow-md'
                          : isSuggested
                          ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] animate-pulse'
                          : isLight
                            ? 'border-black/15 bg-black/5 text-black hover:border-black/40'
                            : 'border-white/15 bg-white/5 text-white hover:border-white/40'
                      }`}
                      onClick={() => setSelectedDiscipline(item.id)}
                    >
                      {item.label}
                      {isActive && <span className="ml-2 text-[10px] font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group relative">
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t.contact?.namePlaceholder || 'Name / Organization'} 
                  required 
                  className={`w-full px-4 py-3 rounded-none border text-xs font-mono transition-all duration-200 focus:outline-none ${
                    isLight 
                      ? 'bg-black/5 border-black/15 text-black placeholder:text-black/40 focus:border-black' 
                      : 'bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-[#00f0ff]'
                  }`} 
                />
              </div>

              <div className="form-group relative">
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t.contact?.emailPlaceholder || 'Direct Email Address'} 
                  required 
                  className={`w-full px-4 py-3 rounded-none border text-xs font-mono transition-all duration-200 focus:outline-none ${
                    isLight 
                      ? 'bg-black/5 border-black/15 text-black placeholder:text-black/40 focus:border-black' 
                      : 'bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-[#00f0ff]'
                  }`} 
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="form-group relative">
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t.contact?.msgPlaceholder || 'Describe your vision, scope, spatial dimensions, or motion deliverables...'} 
                rows="5" 
                required 
                className={`w-full p-4 rounded-none border text-xs font-mono transition-all duration-200 focus:outline-none resize-y ${
                  isLight 
                    ? 'bg-black/5 border-black/15 text-black placeholder:text-black/40 focus:border-black' 
                    : 'bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-[#00f0ff]'
                }`}
              ></textarea>
              
              {/* Character Telemetry */}
              <div className="flex justify-between items-center mt-1 px-1 text-[10px] font-mono opacity-40">
                <span>PAYLOAD_SIZE: {formData.message.length} CHARS</span>
                <span>STATUS: {formData.message.length > 20 ? 'READY_FOR_DISPATCH' : 'INPUT_REQUIRED'}</span>
              </div>
            </div>

            {/* Real-Time Live Command Summary */}
            {(formData.name || formData.email || formData.message) && (
              <div className={`p-3 border rounded-none font-mono text-[11px] space-y-1 ${
                isLight ? 'border-black/10 bg-black/5 text-black/70' : 'border-white/10 bg-white/5 text-white/70'
              }`}>
                <div className="flex items-center justify-between text-[10px] opacity-50 uppercase border-b border-white/10 pb-1">
                  <span>TELEMETRY_PREVIEW</span>
                  <span>CONFIDENTIAL</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div><span className="opacity-40">CLIENT:</span> {formData.name || '—'}</div>
                  <div><span className="opacity-40">TARGET:</span> {disciplines.find(d => d.id === selectedDiscipline)?.label}</div>
                  <div><span className="opacity-40">CONTACT:</span> {formData.email || '—'}</div>
                </div>
              </div>
            )}

            {/* Action Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-none border text-xs uppercase tracking-widest font-mono transition-all duration-300 relative overflow-hidden group ${
                isLight
                  ? 'border-black bg-black text-white hover:bg-transparent hover:text-black'
                  : 'border-white bg-white text-black hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    <span>ENCRYPTING & DISPATCHING...</span>
                  </>
                ) : (
                  <>
                    <span>INITIATE TRANSMISSION</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </span>
            </button>

          </form>
        )}

      </div>
    </section>
  );
}