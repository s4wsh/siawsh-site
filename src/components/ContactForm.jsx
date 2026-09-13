import React, { useState, useEffect } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ContactForm() {
  const { mode, t, isLight, lang } = useStudioTheme();
  const isFa = lang === 'fa';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState('arch');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [detectedTag, setDetectedTag] = useState(null);

  const disciplines = [
    { 
      id: 'arch', 
      label: isFa 
        ? (t?.contact?.disciplines?.arch || 'طراحی معماری و دکوراسیون داخلی') 
        : (t?.contact?.disciplines?.arch || 'Architectural & Interior Design'), 
      keywords: ['arch', 'building', 'facade', 'structure', 'site', 'house', 'cad', 'spatial', 'معماری', 'ساختمان', 'نما'] 
    },
    { 
      id: 'interior', 
      label: isFa 
        ? (t?.contact?.disciplines?.interior || 'معماری داخلی تجاری / مسکونی') 
        : (t?.contact?.disciplines?.interior || 'Commercial / Residential Interior'), 
      keywords: ['interior', 'room', 'clinic', 'office', 'salon', 'layout', 'mural', 'داخلی', 'مطب', 'دفتر', 'دیوارنگاری'] 
    },
    { 
      id: 'furniture', 
      label: isFa 
        ? (t?.contact?.disciplines?.furniture || 'طراحی و ساخت مبلمان سفارشی') 
        : (t?.contact?.disciplines?.furniture || 'Custom Bespoke Furniture'), 
      keywords: ['furniture', 'chair', 'table', 'wood', 'product', 'industrial', 'object', 'مبلمان', 'صندلی', 'میز', 'چوب'] 
    },
    { 
      id: 'motion', 
      label: isFa 
        ? (t?.contact?.disciplines?.motion || 'مووشن گرافیک سه‌بعدی و CGI') 
        : (t?.contact?.disciplines?.motion || '3D Motion Design & CGI'), 
      keywords: ['motion', 'cgi', '3d', 'animation', 'render', 'video', 'blender', 'after effects', 'loop', 'مووشن', 'انیمیشن', 'رندر'] 
    },
    { 
      id: 'branding', 
      label: isFa 
        ? (t?.contact?.disciplines?.branding || 'طراحی هویت بصری و برندسازی') 
        : (t?.contact?.disciplines?.branding || 'Brand Identity & Strategy'), 
      keywords: ['brand', 'identity', 'logo', 'typography', 'kinetic', 'deck', 'guidelines', 'برند', 'لوگو', 'هویت بصری'] 
    }
  ];

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
        alert(t?.contact?.submitError || (isFa ? 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.' : 'Failed to submit inquiry. Please try again.'));
      }
    } catch (error) {
      alert(t?.contact?.connectionError || (isFa ? 'خطا در ارتباط با سرور.' : 'Server connection error.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="contact-section py-8 md:py-12 relative overflow-hidden font-inherit" 
      style={{ fontFamily: isFa ? "Vazirmatn, var(--font-sans), system-ui, sans-serif" : "var(--font-sans), system-ui, sans-serif" }} 
      id="contact"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full">
        
        {/* Container Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-white/10 gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-[10px] tracking-widest text-[#00f0ff] uppercase">
                {isFa ? "پروتکل ارتباطی // سیستم ثبت سفارش" : "COMMUNICATION PROTOCOL // INITIATE COLLABORATION"}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">
              {t?.contact?.title || (isFa ? 'شروع همکاری و مشاوره پروژه' : 'Start a Project')}
            </h2>
          </div>
          <p className="text-xs opacity-50 tracking-widest">
            {isFa 
              ? (mode === 'spatial' ? '[ معماری و طراحی فضا ]' : '[ مووشن گرافیک و سینماتیک ]')
              : (mode === 'spatial' ? '[ SPATIAL ARCHITECTURE ]' : '[ 3D MOTION & CINEMATIC ]')
            }
          </p>
        </div>

        {submitted ? (
          /* Success Screen */
          <div className={`p-8 border rounded-none relative overflow-hidden ${
            isLight ? 'border-black/20 bg-black/5' : 'border-[#00f0ff]/30 bg-[#00f0ff]/5'
          }`}>
            <div className="space-y-3">
              <span className="text-xs text-[#00f0ff] tracking-widest block">
                {isFa ? "[ پیام با موفقیت ثبت شد ]" : "[ MESSAGE SUBMITTED SUCCESSFULLY ]"}
              </span>
              <h3 className="text-2xl font-light tracking-tight">
                {t?.contact?.successTitle || (isFa ? 'اطلاعات پروژه شما دریافت شد' : 'Project Information Received')}
              </h3>
              <p className="text-sm opacity-70 max-w-xl leading-relaxed">
                {t?.contact?.successDesc || (isFa 
                  ? 'با تشکر از ارتباط شما. مشخصات پروژه ثبت گردید و جهت بررسی به مدیر استودیو ارجاع داده شد. به‌زودی با شما تماس خواهیم گرفت.' 
                  : 'Thank you for reaching out. Your project details have been recorded and assigned for review. We will contact you shortly.')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className={`mt-4 px-6 py-2.5 text-xs tracking-wider border rounded-none transition-all duration-300 ${
                  isLight
                    ? 'border-black bg-black text-white hover:bg-transparent hover:text-black'
                    : 'border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black'
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                {isFa ? "ارسال پیام جدید ←" : "Send New Inquiry →"}
              </button>
            </div>
          </div>
        ) : (
          <form className="contact-form space-y-5" onSubmit={handleSubmit}>
            
            {/* Discipline Selector */}
            <div className="discipline-selector space-y-2">
              <div className="flex items-center justify-between">
                <label className="field-label text-[11px] tracking-widest opacity-60">
                  {t?.contact?.disciplineLabel || (isFa ? 'حوزه خدمات مورد نیاز' : 'Required Service Discipline')}
                </label>
                {detectedTag && detectedTag !== selectedDiscipline && (
                  <button
                    type="button"
                    onClick={() => handleApplyDetected(detectedTag)}
                    className="text-[10px] text-[#00f0ff] underline hover:opacity-80 transition-opacity tracking-wider"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {isFa 
                      ? `✦ پیشنهاد هوشمند: تغییر به ${disciplines.find(d => d.id === detectedTag)?.label}؟`
                      : `✦ Smart suggestion: Switch to ${disciplines.find(d => d.id === detectedTag)?.label}?`}
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
                      style={{ fontFamily: 'inherit' }}
                      className={`relative px-4 py-2.5 text-xs tracking-wider border rounded-none transition-all duration-300 ${
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
                      {isActive && <span className={isFa ? "mr-2 text-[10px] font-bold" : "ml-2 text-[10px] font-bold"}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group relative">
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t?.contact?.namePlaceholder || (isFa ? 'نام و نام خانوادگی' : 'Your name')} 
                  required 
                  style={{ fontFamily: 'inherit' }}
                  className={`w-full px-4 py-3 rounded-none border text-xs transition-all duration-200 focus:outline-none ${
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
                  placeholder={t?.contact?.emailPlaceholder || (isFa ? 'آدرس ایمیل یا شماره تماس' : 'Your email')} 
                  required 
                  style={{ fontFamily: 'inherit' }}
                  className={`w-full px-4 py-3 rounded-none border text-xs transition-all duration-200 focus:outline-none ${
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
                placeholder={t?.contact?.msgPlaceholder || (isFa ? 'توضیحی کوتاه درباره مشخصات پروژه (شامل متراژ، کاربرد، زمان‌بندی مدنظر یا بودجه احتمالی) بنویسید...' : 'Tell us about your project...')} 
                rows="5" 
                required 
                style={{ fontFamily: 'inherit' }}
                className={`w-full p-4 rounded-none border text-xs transition-all duration-200 focus:outline-none resize-y ${
                  isLight 
                    ? 'bg-black/5 border-black/15 text-black placeholder:text-black/40 focus:border-black' 
                    : 'bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-[#00f0ff]'
                }`}
              ></textarea>
              
              <div className="flex justify-between items-center mt-1 px-1 text-[10px] opacity-40">
                <span>{isFa ? `تعداد کاراکتر: ${formData.message.length}` : `Character count: ${formData.message.length}`}</span>
                <span>
                  {isFa 
                    ? `وضعیت: ${formData.message.length > 20 ? 'آماده برای ارسال' : 'نیازمند تکمیل اطلاعات'}`
                    : `Status: ${formData.message.length > 20 ? 'Ready to submit' : 'Required details missing'}`}
                </span>
              </div>
            </div>

            {/* Live Command Summary */}
            {(formData.name || formData.email || formData.message) && (
              <div className={`p-3 border rounded-none text-[11px] space-y-1 ${
                isLight ? 'border-black/10 bg-black/5 text-black/70' : 'border-white/10 bg-white/5 text-white/70'
              }`}>
                <div className="flex items-center justify-between text-[10px] opacity-50 border-b border-white/10 pb-1">
                  <span>{isFa ? "پیش‌نمایش اطلاعات ثبت‌شده" : "LIVE INQUIRY SUMMARY"}</span>
                  <span>{isFa ? "محرمانه" : "CONFIDENTIAL"}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div><span className="opacity-40">{isFa ? "نام:" : "Name:"}</span> {formData.name || '—'}</div>
                  <div><span className="opacity-40">{isFa ? "حوزه:" : "Discipline:"}</span> {disciplines.find(d => d.id === selectedDiscipline)?.label}</div>
                  <div><span className="opacity-40">{isFa ? "ارتباط:" : "Contact:"}</span> {formData.email || '—'}</div>
                </div>
              </div>
            )}

            {/* Main Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ fontFamily: 'inherit' }}
              className={`w-full py-4 rounded-none border text-xs tracking-widest transition-all duration-300 relative overflow-hidden group ${
                isLight
                  ? 'border-black bg-black text-white hover:bg-transparent hover:text-black'
                  : 'border-white bg-white text-black hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⚡</span>
                    <span>{isFa ? "در حال رمزنگاری و ارسال..." : "ENCRYPTING & SENDING..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isFa ? "ارسال پیام / شروع همکاری" : "SUBMIT INQUIRY / START COLLABORATION"}</span>
                    <span className={`transition-transform ${isFa ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
                      {isFa ? "←" : "→"}
                    </span>
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