import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ContactPage() {
  const { isLight, lang } = useStudioTheme();
  const isFa = lang === 'fa';

  useEffect(() => {
    document.title = isFa 
      ? "تماس و ثبت سفارش — استودیو سیاوش" 
      : "Contact & Order — SIAWSH Studio";
  }, [isFa]);

  return (
    <div 
      dir={isFa ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}
    >
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
          
          {/* Protocol Sub-tag */}
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase opacity-60 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
            <span>
              {isFa ? "شروع همکاری و ثبت سفارش" : "INITIATE COLLABORATION"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-6">
            {isFa ? "ساخت آینده‌ای مشترک" : "Let's build together"}
          </h1>

          {/* Welcome Message & Order Context */}
          <div className="max-w-3xl space-y-4 text-sm md:text-base opacity-80 leading-relaxed border-b border-white/10 pb-8">
            <p>
              {isFa
                ? "به استودیو سیاوش خوش آمدید. تمرکز اصلی ما بر تولید انیمیشن‌های سه‌بعدی پیشرفته، موشن گرافیک و رندرینگ حرفه‌ای است. همچنین خدمات تخصصی در زمینه‌های طراحی معماری، معماری داخلی، طراحی مبلمان سفارشی و هویت بصری ارائه می‌دهیم."
                : "Welcome to SIAWSH Studio. Our primary focus is on high-end 3D animation, motion graphics, and CGI rendering, complemented by specialized services in spatial architecture, interior design, custom furniture, and brand identity."}
            </p>
            
            {/* Step-by-Step Order Guide */}
            <div className="pt-2 text-xs md:text-sm opacity-90 space-y-1">
              <div className="font-semibold tracking-wider text-[#00f0ff] uppercase mb-2">
                {isFa ? "// مراحل ثبت سفارش:" : "// HOW TO PLACE AN ORDER:"}
              </div>
              <ul className="list-disc list-inside space-y-1 opacity-75">
                <li>
                  {isFa ? "۱. حوزه خدمات مدنظر خود (انیمیشن، رندرینگ، معماری و...) را انتخاب کنید." : "1. Select your required service discipline (Animation, Rendering, Spatial Architecture, etc.)."}
                </li>
                <li>
                  {isFa ? "۲. مشخصات پروژه مانند زمان‌بندی، خروجی‌های مدنظر یا بودجه احتمالی را وارد کنید." : "2. Share project details such as scope, required outputs, timeline, or estimated budget."}
                </li>
                <li>
                  {isFa ? "۳. درخواست خود را ثبت کنید تا تیم ما جهت بررسی اولیه و ارزیابی فنی با شما تماس بگیرد." : "3. Submit your inquiry for our studio team to review and get back to you with a consultation."}
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Interactive Contact Form Component */}
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}