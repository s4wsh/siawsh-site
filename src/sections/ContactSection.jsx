import React, { useState } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ContactSection() {
  const { lang, t, isLight } = useStudioTheme();
  const isFa = lang === 'fa';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discipline: 'arch',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Example submission logic - customize endpoint as needed
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  // Localized string resolution with clean fallbacks
  const contactTitle = isFa 
    ? (t?.contact?.titleFa || t?.contact?.title || "ارتباط با استودیو") 
    : (t?.contact?.title || "CONTACT & INQUIRIES");

  const contactTagline = isFa 
    ? "ثبت سفارش و مشاوره اختصاصی" 
    : "GET IN TOUCH";

  const contactSubtitle = isFa 
    ? (t?.contact?.subtitleFa || t?.contact?.subtitle || "جهت دریافت مشاوره تخصصی، استعلام قیمت یا شروع همکاری در پروژه‌های معماری، موشن‌گرافیک و دیزاین با ما در ارتباط باشید.") 
    : (t?.contact?.subtitle || "Start a conversation regarding spatial projects, CGI motion graphics, custom furniture, or brand identities.");

  return (
    <section 
      id="contact" 
      dir={isFa ? 'rtl' : 'ltr'} 
      className={`py-24 transition-colors duration-500 ${isLight ? 'bg-neutral-50 text-neutral-900' : 'bg-neutral-950 text-neutral-100'}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Value Statement & Contact Meta */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold opacity-60">
                {contactTagline}
              </span>
              <h2 className="text-3xl md:text-4xl font-light leading-tight mt-3">
                {contactTitle}
              </h2>
            </div>

            <p className="text-sm md:text-base opacity-80 leading-relaxed">
              {contactSubtitle}
            </p>

            <div className="pt-6 border-t border-neutral-300 dark:border-neutral-800 space-y-6 text-sm">
              <div>
                <span className="block font-semibold opacity-60 uppercase text-xs mb-1">
                  {isFa ? "ایمیل مستقیم" : (t?.contact?.emailLabel || "DIRECT EMAIL")}
                </span>
                <a 
                  href="mailto:contact@siawsh.co" 
                  className="hover:underline text-base font-medium transition-colors"
                >
                  contact@siawsh.co
                </a>
              </div>

              <div>
                <span className="block font-semibold opacity-60 uppercase text-xs mb-1">
                  {isFa ? "موقعیت استودیو" : (t?.contact?.locationLabel || "STUDIO LOCATION")}
                </span>
                <span className="text-base font-medium">
                  {isFa ? "تهران، ایران / امکان همکاری بین‌المللی" : (t?.contact?.locationValue || "Tehran, Iran / International Commissions")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Order Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider mb-2 opacity-80">
                  {isFa ? "زمینه همکاری / حوزه پروژه" : (t?.contact?.disciplineLabel || "Project Discipline")}
                </label>
                <select
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-none border text-sm focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-white border-neutral-300 focus:border-black text-neutral-900' 
                      : 'bg-neutral-900 border-neutral-800 focus:border-white text-neutral-100'
                  }`}
                >
                  <option value="arch">{t?.contact?.disciplines?.arch || (isFa ? "طراحی معماری و فضا" : "Spatial Architecture")}</option>
                  <option value="interior">{t?.contact?.disciplines?.interior || (isFa ? "طراحی داخلی" : "Interior Design")}</option>
                  <option value="furniture">{t?.contact?.disciplines?.furniture || (isFa ? "طراحی مبلمان اختصاصی" : "Custom Furniture")}</option>
                  <option value="motion">{t?.contact?.disciplines?.motion || (isFa ? "موشن گرافیک سه بعدی و CGI" : "3D Motion & CGI")}</option>
                  <option value="branding">{t?.contact?.disciplines?.branding || (isFa ? "هویت بصری و برندینگ" : "Brand Identity")}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={isFa ? "نام و نام خانوادگی" : (t?.contact?.namePlaceholder || "Your Name")}
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-none border text-sm focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-white border-neutral-300 focus:border-black text-neutral-900' 
                        : 'bg-neutral-900 border-neutral-800 focus:border-white text-neutral-100'
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={isFa ? "نشانی ایمیل" : (t?.contact?.emailPlaceholder || "Your Email")}
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-none border text-sm focus:outline-none transition-colors ${
                      isLight 
                        ? 'bg-white border-neutral-300 focus:border-black text-neutral-900' 
                        : 'bg-neutral-900 border-neutral-800 focus:border-white text-neutral-100'
                    }`}
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder={isFa ? "توضیحات پروژه یا پیام شما..." : (t?.contact?.msgPlaceholder || "Tell us about your project...")}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-none border text-sm focus:outline-none transition-colors ${
                    isLight 
                      ? 'bg-white border-neutral-300 focus:border-black text-neutral-900' 
                      : 'bg-neutral-900 border-neutral-800 focus:border-white text-neutral-100'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full py-4 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isLight 
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800' 
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {status === 'sending' 
                  ? (isFa ? "در حال ارسال..." : (t?.contact?.btnSending || "SENDING...")) 
                  : (isFa ? "ارسال پیام" : (t?.contact?.btnSend || "SEND MESSAGE"))}
              </button>

              {status === 'success' && (
                <div className="p-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm">
                  <p className="font-semibold">
                    {isFa ? "پیام شما با موفقیت دریافت شد" : (t?.contact?.successTitle || "Message Sent Successfully")}
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    {isFa ? "کارشناسان استودیو به‌زودی با شما تماس خواهند گرفت." : (t?.contact?.successDesc || "We will get back to you shortly.")}
                  </p>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}