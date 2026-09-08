import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutSection({ teaser = false }) {
  const { t, lang, activeCategory, currentCategory, mode, isLight } = useStudioTheme();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 50, y: 50 });
  const [isInteracting, setIsInteracting] = useState(false);

  const isFa = lang === 'fa';

  // Active Category Context
  const category = activeCategory || currentCategory || mode || 'spatial';
  const isCinematic = category === 'cinematic' || category === 'motion';

  // Gentle LERP Loop for Fluid & Slow Spatial Light Tracking
  useEffect(() => {
    let animationFrameId;
    const lerpFactor = 0.035;

    const animatePointer = () => {
      setSmoothMousePos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;

        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
          return mousePos;
        }

        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });

      animationFrameId = requestAnimationFrame(animatePointer);
    };

    animationFrameId = requestAnimationFrame(animatePointer);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // Pointer Location Calculation for Desktop Mouse & Mobile Touch
  const updatePointerPosition = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100);
    setMousePos({ x, y });
  };

  // Desktop Mouse Handlers
  const handleMouseMove = (e) => {
    setIsInteracting(true);
    updatePointerPosition(e.clientX, e.clientY, e.currentTarget);
  };

  const handleMouseLeave = () => {
    setIsInteracting(false);
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e) => {
    setIsInteracting(true);
    if (e.touches && e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
  };

  // Master Capabilities Data
  const capabilities = isFa
    ? [
        {
          number: "۰۱",
          category: "دیزاین فضایی",
          title: "طراحی و شبیه‌سازی معماری و فضایی",
          highlightTitle: false,
          description: "مدل‌سازی سه‌بعدی فضایی، رندرینگ فوتورئال، دیزاین محیطی و جانمایی چشم‌انداز.",
          deliverables: ["چیدمان اختصاصی فضا", "رندرهای 3D", "مشاوره نقشه CAD"]
        },
        {
          number: "۰۲",
          category: "طراحی صنعتی",
          title: "طراحی مبلمان سفارشی و دیزاین صنعتی",
          highlightTitle: false,
          description: "ایده‌پردازی و خلق مبلمان سفارشی، تدوین نقشه‌های صنعتی، انتخاب متریال‌های اصیل، بررسی جزئیات ساخت و ارائه نقشه‌های فنی و 3D.",
          deliverables: ["کانسپت مبلمان سفارشی", "نمونه فیزیکی (ماکت)", "شیت مشخصات متریال"]
        },
        {
          number: "۰۳",
          category: "هویت بصری",
          title: "استراتژی برند و سیستم‌های حرکتی",
          highlightTitle: true,
          description: "طراحی جامع سیستم‌های هویت بصری، معماری برند، حرکت‌پذیری پویای لوگو، کارگردانی بصری و هدایت خلاقانه برند.",
          deliverables: ["دفترچه راهنمای برند", "سیستم‌های پویای لوگو", "سیستم جامع دیزاین"]
        },
        {
          number: "۰۴",
          category: "موشن 3D",
          title: "موشن گرافیک 3D و انیمیشن محصول",
          highlightTitle: true,
          description: "انیمیشن‌های فوتورئال محصول، شوکیس‌های متحرک، تایپوگرافی حرکتی و انیماتیک‌های حرفه‌ای خلق‌شده با Blender ،DaVinci Resolve و After Effects.",
          deliverables: ["انیمیشن 3D محصول", "تیزرهای تبلیغاتی", "تایپوگرافی حرکتی"]
        },
        {
          number: "۰۵",
          category: "محصول دیجیتال",
          title: "طراحی وب‌سایت و رابط کاربری (UI/UX)",
          highlightTitle: false,
          description: "طراحی رابط‌های کاربری تعاملی و شوکیس‌های سه‌بعدی وب در Figma، مهندسی‌شده برای پیاده‌سازی با فریم‌ورک‌های مدرن وب.",
          deliverables: ["طراحی UI وب‌سایت", "مدل‌های 3D تعاملی", "نمونه اولیه (Prototype)"]
        }
      ]
    : [
        {
          number: "01",
          category: "Spatial Design",
          title: "Spatial & Architectural Visualization",
          highlightTitle: false,
          description: "High-fidelity architectural rendering, 3D spatial modeling, environment design, and landscape layouts.",
          deliverables: ["Bespoke Spatial Layouts", "3D Renders", "CAD Blueprint Consultation"]
        },
        {
          number: "02",
          category: "Industrial Design",
          title: "Custom Furniture & Industrial Design",
          highlightTitle: false,
          description: "Bespoke furniture conceptualization, industrial design blueprints, tactile material exploration, and 3D CAD visualization.",
          deliverables: ["Custom Furniture Concepts", "Physical Mockups", "Material Spec Sheets"]
        },
        {
          number: "03",
          category: "Visual Identity",
          title: "Brand Strategy & Kinetic Systems",
          highlightTitle: true,
          description: "Comprehensive visual identity systems, brand architecture, kinetic logo motion, and strategic creative art direction.",
          deliverables: ["Brand Guidelines", "Logo Motion Systems", "Design Systems"]
        },
        {
          number: "04",
          category: "3D Motion",
          title: "3D Motion Graphics & Video Animation",
          highlightTitle: true,
          description: "Cinematic CGI render loops, photorealistic product animations, professional color grading, and motion sequences created with Blender, DaVinci Resolve, and After Effects.",
          deliverables: ["3D Product Animation", "CGI Promo Loops", "Kinetic Typography"]
        },
        {
          number: "05",
          category: "Digital Product",
          title: "Digital UI/UX & Web Architecture",
          highlightTitle: false,
          description: "User-centric web interfaces and interactive 3D showcases engineered in Figma and built for modern web deployment.",
          deliverables: ["Web Application UI", "Interactive 3D Models", "Prototypes"]
        }
      ];

  const toolsList = [
    "Blender",
    "Adobe After Effects",
    "DaVinci Resolve",
    "Generative AI Tools",
    "Figma",
    "Photoshop",
    "Illustrator",
    "Adobe Audition",
    "React",
    "Tailwind CSS",
    "Vercel"
  ];

  const cinematicProcessSteps = isFa
    ? [
        {
          step: "۰۱",
          title: "کانسپت، اسکچ و استوری‌بورد",
          description: "اکتشاف بصری اولیه، اسکچ‌های دستی، استوری‌بورد پویا و نقشه‌های زمان‌بندی برای تعریف حرکت و مسیر خلاقانه."
        },
        {
          step: "۰۲",
          title: "بلاک‌اوت ۳ بعدی و پیش‌نویس انیماتیک",
          description: "مدل‌سازی ۳ بعدی با جزئیات کم در Blender، زمان‌بندی انیمیشن، مسیر حرکتی دوربین و پروتوتایپ سریع جهت تأیید اولیه."
        },
        {
          step: "۰۳",
          title: "تکستچر، نورپردازی و شبیه‌سازی",
          description: "تنظیم متریال فیزیکی، محیط‌های نورپردازی، شبیه‌سازی دینامیک پارچه یا پارتیکل و تست رندر باکیفیت."
        },
        {
          step: "۰۴",
          title: "اصلاح رنگ، صدا و تحویل نهایی",
          description: "رندر نهایی CGI، اصلاح رنگ نودمحور در DaVinci Resolve، طراحی صدا در Adobe Audition و خروجی بهینه‌شده دیجیتال."
        }
      ]
    : [
        {
          step: "01",
          title: "Concept, Sketching & Storyboarding",
          description: "Initial visual exploration, hand-drawn wireframe sketches, dynamic storyboarding, and pacing blueprints to define movement and creative direction."
        },
        {
          step: "02",
          title: "3D Blockout & Animatic Draft",
          description: "Low-fidelity 3D modeling in Blender, keyframe animation timing, camera path blockouts, and rapid prototype animatics for early client validation."
        },
        {
          step: "03",
          title: "Texturing, Lighting & Simulation",
          description: "Physically-based material setup, lighting environments, cloth or particle dynamics simulations, and high-fidelity render testing."
        },
        {
          step: "04",
          title: "Color Grading, Sound & Delivery",
          description: "Final CGI rendering, node-based color grading in DaVinci Resolve, sound design pass in Adobe Audition, and optimized digital export."
        }
      ];

  // Wand Light Angle Calculation
  const angle = Math.atan2(smoothMousePos.y - 50, smoothMousePos.x - 50) * (180 / Math.PI) + 180;

  // Master Dynamic Wand Stroke Style (Border Only, Fully Masked Interior)
  const masterWandStrokeStyle = {
    background: isInteracting
      ? `conic-gradient(from ${angle}deg at ${smoothMousePos.x}% ${smoothMousePos.y}%, #00f0ff 0deg, #ff5500 120deg, #00ff66 240deg, #00f0ff 360deg)`
      : `conic-gradient(from 0deg at 50% 50%, #00f0ff 0deg, #ff5500 120deg, #00ff66 240deg, #00f0ff 360deg)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: '1.5px',
  };

  // Clean Transparent Base (Without Backdrop Blur to Prevent Box Clipping)
  const glassCardBaseStyle = isLight
    ? 'bg-white/10 text-black rounded-none shadow-none transition-all duration-500 hover:bg-white/15'
    : 'bg-transparent text-white rounded-none shadow-none transition-all duration-500 hover:bg-white/[0.02]';

  const badgeStyle = isLight
    ? 'bg-black/5 text-black/90 border border-black/10 hover:bg-black/10'
    : 'bg-white/10 text-white/90 border border-white/10 hover:bg-white/15';

  if (teaser) {
    return (
      <section className="about-teaser-section py-3 md:py-4 overflow-visible" id="about" dir={isFa ? 'rtl' : 'ltr'}>
        <div 
          className="mx-auto max-w-7xl px-6 md:px-12 w-full relative group overflow-hidden" 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Architectural Volumetric Light Beam */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
              isInteracting ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
            }`}
            style={{
              background: isFa
                ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
            }}
          />

          {/* 3D Wand Border Stroke */}
          <div 
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-10 ${
              isInteracting ? 'opacity-100' : 'opacity-40 sm:opacity-0 sm:group-hover:opacity-100'
            }`}
            style={masterWandStrokeStyle}
          />

          {/* Wand Stardust / Particle Trail */}
          <div 
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 z-0 overflow-hidden ${
              isInteracting ? 'opacity-100' : 'opacity-30 sm:opacity-0 sm:group-hover:opacity-100'
            }`}
            style={{
              backgroundImage: `
                radial-gradient(1.5px 1.5px at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255,255,255,0.95) 100%, transparent),
                radial-gradient(2px 2px at ${Math.min(smoothMousePos.x + 6, 100)}% ${Math.max(smoothMousePos.y - 10, 0)}%, rgba(0,240,255,0.9) 100%, transparent),
                radial-gradient(1.5px 1.5px at ${Math.max(smoothMousePos.x - 8, 0)}% ${Math.min(smoothMousePos.y + 8, 100)}%, rgba(255,85,0,0.85) 100%, transparent),
                radial-gradient(1px 1px at ${Math.min(smoothMousePos.x + 12, 100)}% ${Math.min(smoothMousePos.y + 12, 100)}%, rgba(0,255,102,0.8) 100%, transparent)
              `
            }}
          />

          <div className={`relative p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 z-20 ${glassCardBaseStyle}`}>
            <div className="space-y-4 max-w-3xl">
              <span className={`text-sm font-sans font-medium uppercase tracking-widest ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                {isFa ? "استودیوی چندرشته‌ای دیزاین" : "STUDIO OVERVIEW"}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug">
                {isFa 
                  ? "خلق سیستم‌های زنده بصری از معماری تا پرده سینما"
                  : "Shaping cohesive visual ecosystems across space, brand, and screen."}
              </h2>
              <p className={`text-base md:text-lg line-clamp-2 ${isLight ? 'text-black/80' : 'text-white/80'}`}>
                {isFa
                  ? "راهبری خلاقانه پروژه‌های معماری داخلی، موشن گرافیک سه‌بعدی، کانسپت مبلمان و هویت بصری برای کسب‌وکارهای خلاق و پروژه‌های بین‌المللی در ایران، قبرس و اروپا."
                  : "Led by creative director Siavash Afsari, SIAWSH operates at the apex of spatial design, CGI, and strategic brand motion."}
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to={isFa ? "/fa/about" : "/about"}
                className={`inline-flex items-center justify-center px-6 py-3.5 border text-sm tracking-wider uppercase transition-all duration-300 font-medium rounded-none ${
                  isLight
                    ? 'border-black/40 text-black bg-white/80 hover:bg-black hover:text-white backdrop-blur-sm'
                    : 'border-white/40 text-white bg-black/50 hover:bg-white hover:text-black backdrop-blur-sm'
                }`}
              >
                {isFa ? "ورود به داستان استودیو ←" : "DISCOVER SIAWSH →"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <article className="about-section py-12 md:py-20 overflow-visible" id="about" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full space-y-16 md:space-y-20">
        
        {/* Header */}
        <header className="about-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-sm font-sans font-medium uppercase tracking-widest opacity-70 block">
              {isFa ? "استودیوی چندرشته‌ای دیزاین" : "STUDIO OVERVIEW"}
            </span>
            <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
              {isFa ? "درباره سیاوش" : "About SIAWSH"}
            </h1>
            <p className="text-xl md:text-2xl font-normal leading-snug opacity-90">
              {isFa
                ? "خلق سیستم‌های زنده بصری از معماری تا پرده سینما"
                : "Shaping cohesive visual ecosystems across space, brand, and screen."}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base md:text-lg leading-relaxed opacity-85">
            <p>
              {isFa
                ? "تحت هدایت مدیر خلاقیت، سیاوش افسری، استودیوی SIAWSH در نقطه تلاقی دیزاین فضایی، CGI و موشن استراتژیک برند فعالیت می‌کند. این استودیو به استارت‌آپ‌های پیشرو فناوری، کارفرمایان معماری و برندهای مطرح کمک می‌کند تا ایده‌های پیچیده را به سیستم‌های بصری شفاف، ملموس و پرقدرت تبدیل نمایند."
                : "Led by creative director Siavash Afsari, SIAWSH operates at the apex of spatial design, CGI, and strategic brand motion. The studio helps ambitious technology startups, architectural clients, and established brands translate complex ideas into clear, tactile, and high-impact visual systems."}
            </p>
            <p>
              {isFa
                ? "تخصص استودیو شامل طراحی موشن ۳ بعدی، انیمیشن CGI محصول، کانسپت‌های اختصاصی مبلمان و تایپوگرافی پویا است که داستان‌سرایی بصری را در رسانه‌های فیزیکی و دیجیتال ارتقا می‌دهد."
                : "Specializing in 3D motion design, CGI product animation, custom furniture concepts, and kinetic typography that elevates visual storytelling across physical and digital mediums."}
            </p>
          </div>
        </header>

        {/* Achievements */}
        <section aria-label="Studio Achievements" className="stats-grid grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={`p-8 space-y-3 transition-all duration-300 border border-current/10 ${glassCardBaseStyle}`}>
            <span className="stat-number block text-4xl md:text-5xl font-light text-[#00f0ff]">
              ۱۰+
            </span>
            <span className="stat-label text-sm uppercase tracking-widest opacity-70 block font-medium">
              {isFa ? "سال فعالیت چندرشته‌ای در حوزه دیزاین" : "Years of Multidisciplinary Design Practice"}
            </span>
          </div>

          <div className={`p-8 space-y-3 transition-all duration-300 border border-current/10 ${glassCardBaseStyle}`}>
            <span className="stat-number block text-4xl md:text-5xl font-light text-[#00f0ff]">
              ۴۰+
            </span>
            <span className="stat-label text-sm uppercase tracking-widest opacity-70 block font-medium">
              {isFa ? "سفارش و پروژه بین‌المللی تکمیل‌شده" : "Commissions & Global Projects Delivered"}
            </span>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="capabilities-block space-y-8" aria-label="Core Capabilities">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-current/10">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">
              {isFa ? "توانمندی‌های اصلی" : "Core Capabilities"}
            </h2>
            <span className="text-sm font-sans font-medium opacity-60 uppercase tracking-widest">
              {isFa ? "خدمات و خروجی‌ها" : "Services & Deliverables"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap) => (
              <div 
                key={cap.number} 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="relative group overflow-hidden"
              >
                {/* Architectural Volumetric Light Beam */}
                <div 
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
                    isInteracting ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                  }`}
                  style={{
                    background: isFa
                      ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                      : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                  }}
                />

                {/* 3D Wand Border Line */}
                <div 
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 ${
                    isInteracting ? 'opacity-100' : 'opacity-40 sm:opacity-0 sm:group-hover:opacity-100'
                  }`}
                  style={masterWandStrokeStyle}
                />

                {/* Stardust Particle Trail */}
                <div 
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 z-0 ${
                    isInteracting ? 'opacity-100' : 'opacity-30 sm:opacity-0 sm:group-hover:opacity-100'
                  }`}
                  style={{
                    backgroundImage: `
                      radial-gradient(1.5px 1.5px at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255,255,255,0.95) 100%, transparent),
                      radial-gradient(2px 2px at ${Math.min(smoothMousePos.x + 5, 100)}% ${Math.max(smoothMousePos.y - 8, 0)}%, rgba(0,240,255,0.85) 100%, transparent),
                      radial-gradient(1.5px 1.5px at ${Math.max(smoothMousePos.x - 6, 0)}% ${Math.min(smoothMousePos.y + 6, 100)}%, rgba(255,85,0,0.8) 100%, transparent),
                      radial-gradient(1px 1px at ${Math.min(smoothMousePos.x + 10, 100)}% ${Math.min(smoothMousePos.y + 10, 100)}%, rgba(0,255,102,0.75) 100%, transparent)
                    `
                  }}
                />

                <article className={`p-8 space-y-6 flex flex-col justify-between border border-current/10 z-20 relative ${glassCardBaseStyle}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm opacity-70 font-sans font-medium">
                      <span>{cap.category}</span>
                      <span className="text-[#00f0ff] font-bold text-base">{cap.number}</span>
                    </div>

                    <h3 className={`text-xl md:text-2xl font-bold tracking-tight leading-snug ${
                      cap.highlightTitle ? 'text-[#00f0ff]' : ''
                    }`}>
                      {cap.title}
                    </h3>

                    <p className="text-base opacity-80 leading-relaxed font-normal">
                      {cap.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-current/10 space-y-3">
                    <span className="text-sm opacity-60 block">
                      {isFa ? "خروجی‌ها:" : "Deliverables:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {cap.deliverables.map((item, idx) => (
                        <span 
                          key={idx} 
                          className={`px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-none ${badgeStyle}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* Software & Tooling */}
        <section className={`p-8 md:p-10 space-y-6 border border-current/10 ${glassCardBaseStyle}`}>
          <div className="space-y-2">
            <span className="text-sm font-sans font-medium uppercase tracking-widest opacity-60 block">
              {isFa ? "پایپ‌لاین تولید" : "Production Pipeline"}
            </span>
            <h2 className="text-xl md:text-2xl font-light tracking-tight">
              {isFa ? "اکوسیستم نرم‌افزارها و ابزارها" : "Tooling & Software Ecosystem"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {toolsList.map((tool) => (
              <span 
                key={tool} 
                className={`px-4 py-2.5 text-sm font-sans font-medium border rounded-none transition-all duration-300 ${
                  isLight 
                    ? 'border-black/20 bg-white/80 text-black hover:border-black/50' 
                    : 'border-white/20 bg-black/50 text-white hover:border-white/50'
                }`}
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* Category Specific Pipeline */}
        {isCinematic ? (
          <section className={`p-8 md:p-10 space-y-8 border border-current/10 ${glassCardBaseStyle}`}>
            <div className="space-y-2">
              <span className="text-sm font-sans font-medium uppercase tracking-widest opacity-60 block">
                {isFa ? "پایپ‌لاین موشن" : "Motion Pipeline"}
              </span>
              <h2 className="text-xl md:text-2xl font-light tracking-tight">
                {isFa 
                  ? "فرآیند موشن سینمایی: از اسکچ تا رندر نهایی"
                  : "Cinematic Motion Process: Sketching to Final Render"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cinematicProcessSteps.map((step) => (
                <div 
                  key={step.step}
                  className={`p-6 border rounded-none space-y-3 transition-all duration-300 ${
                    isLight 
                      ? 'border-[#00f0ff]/30 bg-white/40 hover:border-[#00f0ff]' 
                      : 'border-[#00f0ff]/20 bg-[#00f0ff]/5 hover:border-[#00f0ff]/60'
                  }`}
                >
                  <span className="text-sm font-bold text-[#00f0ff] block">{step.step}</span>
                  <h3 className="text-base font-bold tracking-tight">{step.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className={`p-8 md:p-10 space-y-4 border border-current/10 ${glassCardBaseStyle}`}>
            <span className="text-sm font-sans font-medium uppercase tracking-widest opacity-60 block">
              {isFa ? "متدولوژی معماری" : "Architectural Methodology"}
            </span>
            <h2 className="text-xl md:text-2xl font-light tracking-tight">
              {isFa ? "فلسفه و فرآیند دیزاین فضایی" : "Spatial Design Philosophy & Process"}
            </h2>
            <p className="text-base md:text-lg leading-relaxed opacity-85 max-w-4xl">
              {isFa
                ? "هر پروژه فضایی با تحقیقات محیطی، آزمایش‌های ساختاری سایت و مدل‌سازی ۳ بعدی CAD آغاز می‌شود. با حفظ کنترل بر نقشه‌های اولیه، انتخاب متریال و کانسپت‌های مبلمان سفارشی، استودیوی SIAWSH محیط‌های فضایی یکپارچه‌ای خلق می‌کند که برای تأثیرگذاری در دنیای واقعی مهندسی شده‌اند."
                : "Every spatial project begins with environmental research, site structural experimentation, and 3D CAD modeling. By maintaining control over early blueprint layouts, material selections, and custom furniture concepts, SIAWSH delivers cohesive spatial environments engineered for real-world impact."}
            </p>
          </section>
        )}

      </div>
    </article>
  );
}