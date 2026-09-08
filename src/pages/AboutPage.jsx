import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutSection() {
  const canvasRef = useRef(null);
  const { isLight, lang } = useStudioTheme();
  const isEn = lang === 'en';

  // Pointer & Smooth Interactive Light Tracking State
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 50, y: 50 });
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  // Gentle LERP Loop for Fluid & Slow Light Tracking
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

  // Pointer Position Handlers (Desktop Mouse & Touch Screen)
  const updatePointerPosition = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100);
    setMousePos({ x, y });
  };

  const handlePointerMove = (e, index) => {
    setActiveCardIndex(index);
    updatePointerPosition(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchStartMove = (e, index) => {
    setActiveCardIndex(index);
    if (e.touches && e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handlePointerLeave = () => {
    setActiveCardIndex(null);
  };

  // Dynamic Wand Stroke Border Gradient Angle
  const wandAngle = Math.atan2(smoothMousePos.y - 50, smoothMousePos.x - 50) * (180 / Math.PI) + 180;

  // Very thin, subtle stroke styling
  const getWandStrokeStyle = (isCardActive) => ({
    background: isCardActive
      ? `conic-gradient(from ${wandAngle}deg at ${smoothMousePos.x}% ${smoothMousePos.y}%, #00f0ff 0deg, #ff5500 120deg, #00ff66 240deg, #00f0ff 360deg)`
      : `conic-gradient(from 0deg at 50% 50%, #00f0ff 0deg, #ff5500 120deg, #00ff66 240deg, #00f0ff 360deg)`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    padding: '1px', // Extremely thin stroke line
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles/Stars setup
    const numParticles = window.innerWidth < 768 ? 100 : 180;
    const particles = Array.from({ length: numParticles }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.004,
    }));

    // Scroll positioning synced for camera motion
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angle += 0.002;
      const cameraX = Math.sin(angle) * (window.innerWidth < 768 ? 40 : 120);
      const cameraY = scrollY * 0.35 + Math.cos(angle * 0.8) * 50;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Daylight atmospheric gradient background in light mode
      if (isLight) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(0.5, '#f1f5f9');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Render floating particles
      particles.forEach((particle) => {
        let projectedX = particle.x - cameraX;
        let projectedY = particle.y - cameraY;

        if (projectedX < -centerX * 1.5) particle.x += canvas.width * 2;
        if (projectedX > centerX * 1.5) particle.x -= canvas.width * 2;
        if (projectedY < -centerY * 1.5) particle.y += canvas.height * 2;
        if (projectedY > centerY * 1.5) particle.y -= canvas.height * 2;

        const screenX = centerX + projectedX;
        const screenY = centerY + projectedY;

        particle.alpha += particle.speed;
        if (particle.alpha > 1 || particle.alpha < 0) {
          particle.speed = -particle.speed;
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, particle.radius, 0, Math.PI * 2);

        if (isLight) {
          ctx.fillStyle = `rgba(180, 150, 100, ${Math.abs(particle.alpha) * 0.35})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(particle.alpha) * 0.8})`;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  // Smooth hover effect styling matching portfolio cards
  const cardContainerClass = `group relative p-6 border transition-all duration-700 ease-out transform hover:-translate-y-1 hover:scale-[1.01] overflow-hidden ${
    isEn ? 'text-left' : 'text-right'
  } ${
    isLight 
      ? 'border-black/10 text-black hover:bg-black/[0.02] hover:border-black/25' 
      : 'border-white/10 text-white hover:bg-white/[0.03] hover:border-white/25'
  }`;

  const borderSubClass = isLight ? 'border-black/10' : 'border-white/10';

  return (
    <div className={`relative w-full overflow-hidden transition-colors duration-500 ${
      isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
    } ${
      isLight ? 'bg-transparent text-black' : 'bg-black text-white'
    }`}>
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      <div className="relative z-10">
        <Navbar />

        <section dir={isEn ? 'ltr' : 'rtl'} className={`w-full py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto space-y-20 ${
          isEn ? 'text-left' : 'text-right'
        }`}>
          
          {/* Header & Main Introduction */}
          <div className={`space-y-6 max-w-4xl pt-8 md:pt-12 ${isEn ? 'text-left' : 'text-right'}`}>
            <span className={`text-base font-normal uppercase tracking-widest block ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/50' : 'text-white/50'
            }`}>
              {isEn ? 'SIAWSH STUDIO' : 'استودیوی چندرشته‌ای'}
            </span>
            
            <h1 className={`text-2xl md:text-3xl font-normal tracking-tight leading-tight ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'About SIAWSH Studio' : 'درباره استودیوی سیاوش'}
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
              {isEn 
                ? 'The Intersection of Spatial Architecture, Cinematic CGI, Brand Strategy & Motion Design' 
                : 'تلاقی معماری، سینما، استراتژی برند و موشن دیزاین'}
            </h2>

            <div className={`space-y-6 text-base md:text-lg font-normal leading-relaxed pt-4 ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? (
                <>
                  <p>
                    SIAWSH Studio is an international multidisciplinary creative practice led by Siavash Afsari. Operating at the apex of architecture, digital media, and brand strategy, our multidisciplinary team architects cohesive visual languages that transcend traditional platforms. We view visual identity not as a static visual system, but as a living ecosystem—one that moves effortlessly across architectural environments, cinematic productions, high-fidelity CGI, commercial motion graphics, bespoke furniture, and core brand strategy.
                  </p>
                  <p>
                    Rather than operating within rigid disciplinary silos, we approach every commission through holistic art direction, spatial intuition, and uncompromising visual fidelity. By pairing tactile material authenticity and geometric precision with cutting-edge digital pipelines, we empower visionary architecture firms, global brands, tech innovators, and film productions to transform ambitious ideas into enduring visual assets. The result: scalable, high-impact brand worlds designed for both the physical and digital realms.
                  </p>
                  <p>
                    Our signature expertise spans 3D product motion design, photorealistic CGI animation, cinematic architectural visualisation, custom furniture concepts, and kinetic typography—amplifying storytelling across digital touchpoints, spatial environments, and the cinema screen.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    استودیوی سیاوش یک مجموعه تخصصی و چندرشته‌ای در حوزه دیزاین، معماری، تولیدات سینمایی و کارگردانی بصری به مدیریت سیاوش افسری است که با تمرکز بر خلق و ساخت «زبان بصری» فعالیت می‌کند. ما باور داریم که یک هویت بصری قوی و اصیل، به یک ابزار یا بستر خاص محدود نمی‌شود؛ بلکه کیفیتی زنده است که می‌تواند به‌زیبایی در دلِ طراحی معماری و فضاهای داخلی، در روحِ سینما، تیزرهای تبلیغاتی و CGI، روی بومِ نقاشی دیواری و تبلیغات محیطی، در نبضِ موشن گرافیک سه‌بعدی، در پیکره‌ی مبلمان سفارشی و طراحی صنعتی، یا در بن‌مایه‌ی هویت بصری و لوگو زندگی کند.
                  </p>
                  <p>
                    تیم ما به‌جای محدود ماندن در مرزهای یک تخصص واحد، مسیر خلق اثر را از زاویه «کارگردانی بصری و کیفیت تصویر» می‌بیند. ما با شناخت عمیق از متریال‌های باکیفیت، نورپردازی، هندسه و فرم، به دفاتر پیشرو معماری، پروژه‌های سینمایی و تبلیغاتی، برندهای مطرح، استارتاپ‌های فناوری و صاحبان کسب‌وکارهای خلاق کمک می‌کنیم تا ایده‌ها و استراتژی‌های خود را به سیستم‌های بصری زنده، هوشمند و ماندگار تبدیل کنند؛ خروجی‌هایی که در همان نگاه اول جذاب و اثرگذارند و ارزش برند یا پروژه شما را در هر دو جهان فیزیکی و دیجیتال ارتقا می‌بخشند.
                  </p>
                  <p>
                    تمرکز ویژه استودیو بر موشن دیزاین سه‌بعدی، انیمیشن CGI، رندرهای سینماتیک، کانسپت‌های اختصاصی مبلمان و تایپوگرافی حرکتی است که روایت‌گری بصری را در بسترهای فیزیکی، دیجیتال و پرده سینما ارتقا می‌دهد.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Studio Scale & Impact Metrics Cards */}
          <div className={`border-y py-10 ${isEn ? 'text-left' : 'text-right'} ${borderSubClass}`}>
            <h3 className={`text-lg md:text-xl font-normal uppercase tracking-widest mb-8 ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'STUDIO SCALE & GLOBAL REACH' : 'مقیاس و تجربه استودیو'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  value: isEn ? '10+ Years' : '۱۰+ سال',
                  label: isEn ? 'Experience' : 'سابقه',
                  desc: isEn 
                    ? 'Multidisciplinary design leadership across digital media, CGI, and spatial architecture.' 
                    : 'تجربه فعالیت تخصصی و چندرشته‌ای در دیزاین و هنرهای بصری',
                },
                {
                  value: isEn ? '40+ Projects' : '۴۰+ پروژه',
                  label: isEn ? 'Delivered' : 'تحویل داده شده',
                  desc: isEn 
                    ? 'High-profile international commissions delivered across Europe, Cyprus, and global markets.' 
                    : 'سفارش اختصاصی و پروژه بین‌المللی تحویل داده‌شده',
                },
              ].map((metric, idx) => {
                const cardId = `metric-${idx}`;
                const isCardActive = activeCardIndex === cardId;
                return (
                  <div
                    key={idx}
                    onMouseMove={(e) => handlePointerMove(e, cardId)}
                    onMouseLeave={handlePointerLeave}
                    onTouchStart={(e) => handleTouchStartMove(e, cardId)}
                    onTouchMove={(e) => handleTouchStartMove(e, cardId)}
                    onTouchEnd={handlePointerLeave}
                    className={cardContainerClass}
                  >
                    {/* Volumetric Architectural Light Cone Beam */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
                        isCardActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                      }`}
                      style={{
                        background: isEn
                          ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                          : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                      }}
                    />

                    {/* Very Thin 3D Dynamic Wand Border Stroke */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-10 ${
                        isCardActive ? 'opacity-75' : 'opacity-20 sm:opacity-0 sm:group-hover:opacity-60'
                      }`}
                      style={getWandStrokeStyle(isCardActive)}
                    />

                    {/* Wand Stardust Particle Trail */}
                    <div 
                      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 z-0 overflow-hidden ${
                        isCardActive ? 'opacity-100' : 'opacity-30 sm:opacity-0 sm:group-hover:opacity-100'
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

                    <div className="relative z-20">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-3xl md:text-4xl font-normal tracking-tight leading-none ${
                          isLight ? 'text-cyan-600' : 'text-cyan-400'
                        }`}>
                          {metric.value}
                        </span>
                        <span className={`text-xs uppercase tracking-widest ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                          {metric.label}
                        </span>
                      </div>
                      <p className={`text-sm font-normal leading-relaxed ${
                        isLight ? 'text-black/70' : 'text-white/70'
                      }`}>
                        {metric.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Capabilities Cards */}
          <div className={`space-y-12 ${isEn ? 'text-left' : 'text-right'}`}>
            <h3 className={`text-lg md:text-xl font-normal uppercase tracking-widest ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'CORE CAPABILITIES' : 'توانمندی‌های اصلی (خدمات و خروجی‌ها)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(isEn ? [
                {
                  num: '01',
                  category: 'Architecture & Render',
                  title: 'Architectural Design, Spatial Planning & 3D Visualisation',
                  desc: 'High-end architectural design, spatial layout planning, photorealistic 3D visualization, interior styling, and environmental landscaping.',
                  outcomes: ['Architectural Spatial Concepts', 'Cinematic 3D Visualisations', 'CAD Construction Specs'],
                },
                {
                  num: '02',
                  category: 'Cinema & CGI',
                  title: 'Cinematic Direction, VFX & CGI Production',
                  desc: 'High-fidelity visual effects (VFX), cinematic CGI render loops, complex motion choreography, video editing, and film-grade color grading for commercial campaigns and luxury advertising.',
                  outcomes: ['CGI & VFX Sequences', 'Cinematic Commercial Teasers', 'Node-Based Color Grading'],
                },
                {
                  num: '03',
                  category: 'Industrial Design',
                  title: 'Custom Furniture & Industrial Product Design',
                  desc: 'End-to-end industrial design, bespoke furniture concepts, technical fabrication blueprints, material curation, and 3D prototyping.',
                  outcomes: ['Custom Furniture Concepts', 'Scale Prototypes', 'Technical Fabrication Sheets'],
                },
                {
                  num: '04',
                  category: 'Brand Identity',
                  title: 'Brand Strategy & Kinetic Identity Systems',
                  desc: 'Comprehensive visual identity design, brand architecture, motion branding systems, kinetic logo design, and creative direction.',
                  outcomes: ['Brand Style Guidelines (Brand Book)', 'Kinetic Logo Systems', 'Design Systems'],
                },
                {
                  num: '05',
                  category: '3D Motion',
                  title: '3D Motion Graphics & Product CGI',
                  desc: 'Photorealistic 3D product animations, dynamic motion graphics, web showcases, and animatic storyboarding engineered via Blender, DaVinci Resolve, and After Effects.',
                  outcomes: ['3D Product Animations', 'Commercial Motion Teasers', 'Kinetic Typography Assets'],
                },
                {
                  num: '06',
                  category: 'Digital Product',
                  title: 'Digital Product Design & UI/UX Engineering',
                  desc: 'Interactive web interfaces, digital editorial platforms, and 3D web experiences designed in Figma and built for modern high-performance web frameworks.',
                  outcomes: ['Web UI/UX Interfaces', 'Interactive 3D Web Models', 'Functional Web Prototypes'],
                },
              ] : [
                {
                  num: '۰۱',
                  category: 'معماری و رندر',
                  title: 'طراحی معماری، دکوراسیون داخلی و رندر 3D',
                  desc: 'بازنمایی فوتورئال معماری، مدلسازی سه‌بعدی فضاهای داخلی و خارجی، دیزاین محیطی و جانمایی فضای سبز.',
                  outcomes: ['طراحی فضاهای معماری', 'رندرهای ۳D معماری', 'مشاوره نقشه CAD'],
                },
                {
                  num: '۰۲',
                  category: 'سینما و CGI',
                  title: 'کارگردانی سینمایی، جلوه‌های بصری (VFX) و CGI',
                  desc: 'تولید جلوه‌های ویژه بصری، رندرلوپ‌های سینماتیک CGI، ساخت سکانس‌های حرکتی پیچیده، تدوین سینمایی و تصحیح رنگ تخصصی برای پروژه‌های تصویر متحرک و ویدیوهای تبلیغاتی فاخر.',
                  outcomes: ['سکانس‌های VFX و CGI', 'تیزرهای سینماتیک', 'اصلاح رنگ سینماتیک'],
                },
                {
                  num: '۰۳',
                  category: 'طراحی صنعتی',
                  title: 'طراحی مبلمان سفارشی و دیزاین صنعتی',
                  desc: 'ایده‌پرازی و خلق مبلمان سفارشی، تدوین نقشه‌های صنعتی، انتخاب متریال‌های اصیل، بررسی جزئیات ساخت و ارائه نقشه‌های فنی و ۳D.',
                  outcomes: ['کانسبت مبلمان سفارشی', 'نمونه فیزیکی (ماکت)', 'شیت مشخصات متریال'],
                },
                {
                  num: '۰۴',
                  category: 'هویت بصری',
                  title: 'استراتژی برند و سیستم‌های حرکتی',
                  desc: 'طراحی جامع سیستم‌های هویت بصری، معماری برند، حرکت‌پذیری پویای لوگو، کارگردانی بصری و هدایت خلاقانه برند.',
                  outcomes: ['دفترچه راهنمای برند', 'سیستم‌های پویای لوگو', 'سیستم جامع دیزاین'],
                },
                {
                  num: '۰۵',
                  category: 'موشن ۳D',
                  title: 'موشن گرافیک 3D و انیمیشن محصول',
                  desc: 'انیمیشن‌های فوتورئال محصول، شوکیس‌های متحرک، تایپوگرافی حرکتی و انیماتیک‌های حرفه‌ای خلق‌شده با Blender، DaVinci Resolve و After Effects.',
                  outcomes: ['انیمیشن ۳D محصول', 'تیزرهای تبلیغاتی', 'تایپوگرافی حرکتی'],
                },
                {
                  num: '۰۶',
                  category: 'محصول دیجیتال',
                  title: 'طراحی وب‌سایت و رابط کاربری (UI/UX)',
                  desc: 'طراحی رابط‌های کاربری تعاملی و شوکیس‌های سه‌بعدی وب در Figma، مهندسی‌شده برای پیاده‌سازی با فریم‌ورک‌های مدرن وب.',
                  outcomes: ['طراحی UI وب‌سایت', 'مدل‌های ۳D تعاملی', 'نمونه اولیه (Prototype)'],
                },
              ]).map((item, index) => {
                const cardId = `cap-${index}`;
                const isCardActive = activeCardIndex === cardId;
                return (
                  <div 
                    key={index} 
                    onMouseMove={(e) => handlePointerMove(e, cardId)}
                    onMouseLeave={handlePointerLeave}
                    onTouchStart={(e) => handleTouchStartMove(e, cardId)}
                    onTouchMove={(e) => handleTouchStartMove(e, cardId)}
                    onTouchEnd={handlePointerLeave}
                    className={`flex flex-col justify-between ${cardContainerClass}`}
                  >
                    {/* Volumetric Architectural Light Cone Beam */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
                        isCardActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                      }`}
                      style={{
                        background: isEn
                          ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                          : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                      }}
                    />

                    {/* Very Thin 3D Dynamic Wand Border Stroke */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-10 ${
                        isCardActive ? 'opacity-75' : 'opacity-20 sm:opacity-0 sm:group-hover:opacity-60'
                      }`}
                      style={getWandStrokeStyle(isCardActive)}
                    />

                    {/* Wand Stardust Particle Trail */}
                    <div 
                      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 z-0 overflow-hidden ${
                        isCardActive ? 'opacity-100' : 'opacity-30 sm:opacity-0 sm:group-hover:opacity-100'
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

                    <div className="relative z-20 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                          {item.num}
                        </span>
                        <span className={`text-xs uppercase tracking-widest ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                          {item.category}
                        </span>
                      </div>

                      <h4 className="text-lg font-semibold leading-snug group-hover:text-cyan-500 transition-colors duration-300">
                        {item.title}
                      </h4>

                      <p className={`text-sm font-normal leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                        {item.desc}
                      </p>
                    </div>

                    <div className={`relative z-20 mt-6 pt-4 border-t ${borderSubClass}`}>
                      <span className={`text-xs font-medium block mb-2 ${isLight ? 'text-black/50' : 'text-white/50'}`}>
                        {isEn ? 'Deliverables:' : 'خروجی‌ها:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.outcomes.map((outcome, i) => (
                          <span 
                            key={i} 
                            className={`text-xs px-2 py-0.5 rounded ${
                              isLight ? 'bg-black/5 text-black/80' : 'bg-white/10 text-white/80'
                            }`}
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tooling & Software Cards */}
          <div className={`border-t pt-12 space-y-6 ${isEn ? 'text-left' : 'text-right'} ${borderSubClass}`}>
            <h3 className={`text-lg md:text-xl font-normal uppercase tracking-widest ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'TOOLING & TECHNOLOGY ECOSYSTEM' : 'زیست‌بوم ابزارها و نرم‌افزارها'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  category: isEn ? 'Specialized Tooling' : 'ابزار تخصصی',
                  title: isEn ? 'Cinema, Motion & 3D Pipeline' : 'سینما، موشن و 3D',
                  tools: 'Blender / Adobe After Effects / DaVinci Resolve / VFX & Generative AI Tools',
                },
                {
                  category: isEn ? 'Specialized Tooling' : 'ابزار تخصصی',
                  title: isEn ? 'Brand & Visual Design' : 'گرافیک و برند',
                  tools: 'Figma / Photoshop / Illustrator / Adobe Audition',
                },
                {
                  category: isEn ? 'Specialized Tooling' : 'ابزار تخصصی',
                  title: isEn ? 'Web Engineering & Frontend' : 'طراحی وب‌سایت و فرانت‌اند',
                  tools: 'React / Vite / Tailwind CSS / Lenis (Smooth Scroll) / Vercel',
                },
              ].map((item, index) => {
                const cardId = `tool-${index}`;
                const isCardActive = activeCardIndex === cardId;
                return (
                  <div 
                    key={index} 
                    onMouseMove={(e) => handlePointerMove(e, cardId)}
                    onMouseLeave={handlePointerLeave}
                    onTouchStart={(e) => handleTouchStartMove(e, cardId)}
                    onTouchMove={(e) => handleTouchStartMove(e, cardId)}
                    onTouchEnd={handlePointerLeave}
                    className={cardContainerClass}
                  >
                    {/* Volumetric Architectural Light Cone Beam */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
                        isCardActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                      }`}
                      style={{
                        background: isEn
                          ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                          : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                      }}
                    />

                    {/* Very Thin 3D Dynamic Wand Border Stroke */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-10 ${
                        isCardActive ? 'opacity-75' : 'opacity-20 sm:opacity-0 sm:group-hover:opacity-60'
                      }`}
                      style={getWandStrokeStyle(isCardActive)}
                    />

                    {/* Wand Stardust Particle Trail */}
                    <div 
                      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 z-0 overflow-hidden ${
                        isCardActive ? 'opacity-100' : 'opacity-30 sm:opacity-0 sm:group-hover:opacity-100'
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

                    <div className="relative z-20">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs uppercase tracking-widest ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                          {item.category}
                        </span>
                      </div>
                      <h4 className={`text-base font-medium mb-3 ${
                        isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
                      } ${
                        isLight ? 'text-black/90' : 'text-white/90'
                      }`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm font-normal leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`} dir="ltr">
                        {item.tools}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motion Pipeline Process Cards */}
          <div className={`border-t pt-12 space-y-8 ${isEn ? 'text-left' : 'text-right'} ${borderSubClass}`}>
            <h3 className={`text-lg md:text-xl font-normal uppercase tracking-widest ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'CREATIVE PIPELINE' : 'فرایند خلق اثر (از ایده‌پردازی تا رندر و تولیدنهایی)'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(isEn ? [
                {
                  num: '01',
                  phase: '',
                  title: 'Discovery, Concept & Storyboarding',
                  desc: 'Visual research, narrative design, concept drafting, dynamic storyboards, and spatial/motion pacing to define the creative vision.',
                },
                {
                  num: '02',
                  phase: '',
                  title: '3D Blockout & Animatic Build',
                  desc: 'Structural 3D drafting in Blender, camera direction, timing alignment, and animatic previews for client sign-off.',
                },
                {
                  num: '03',
                  phase: '',
                  title: 'PBR Materials, Lighting & Simulation',
                  desc: 'Physically-Based Rendering (PBR) texturing, cinematic lighting setups, cloth/particle simulations, and test renders.',
                },
                {
                  num: '04',
                  phase: '',
                  title: 'Grading, Audio Mastering & Final Export',
                  desc: 'High-resolution CGI rendering, node-based color grading in DaVinci Resolve, spatial sound design in Adobe Audition, and optimized multi-platform deployment.',
                },
              ] : [
                {
                  num: '۰۱',
                  phase: '',
                  title: 'ایده، اسکچ و استوری‌بورد',
                  desc: 'بررسی اولیه تصویری، ترسیم خطی طرح‌ها، استوری‌بورد پویا و تدوین ریتم حرکت یا فضا برای مشخص‌کردن مسیر خلاقانه.',
                },
                {
                  num: '۰۲',
                  phase: '',
                  title: 'مدلسازی اولیه و پیش‌نمایش حرکتی',
                  desc: 'مدلسازی ساختاری اولیه در Blender، زمان‌بندی انیمیشن، تنظیم مسیر دوربین و ساخت نمونه اولیه سریع برای تایید نهایی.',
                },
                {
                  num: '۰۳',
                  phase: '',
                  title: 'متریال، نور و شبیه‌سازی',
                  desc: 'تنظیم متریال‌های واقعی مبتنی بر فیزیک (PBR)، نورپردازی محیطی و سینماتیک، شبیه‌سازی فیزیکی پارچه و ذرات، و رندر آزمایشی باکیفیت.',
                },
                {
                  num: '۰۴',
                  phase: '',
                  title: 'اصلاح رنگ، صدا و تحویل نهایی',
                  desc: 'رندر نهایی CGI/VFX، تصحیح رنگ گره‌محور (Node-based) در DaVinci Resolve، طراحی و تنظیم صدا در Adobe Audition و خروجی دیجیتال یا سینمایی بهینه‌شده.',
                },
              ]).map((step, index) => {
                const cardId = `pipeline-${index}`;
                const isCardActive = activeCardIndex === cardId;
                return (
                  <div 
                    key={index} 
                    onMouseMove={(e) => handlePointerMove(e, cardId)}
                    onMouseLeave={handlePointerLeave}
                    onTouchStart={(e) => handleTouchStartMove(e, cardId)}
                    onTouchMove={(e) => handleTouchStartMove(e, cardId)}
                    onTouchEnd={handlePointerLeave}
                    className={`flex flex-col justify-between ${cardContainerClass}`}
                  >
                    {/* Volumetric Architectural Light Cone Beam */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
                        isCardActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                      }`}
                      style={{
                        background: isEn
                          ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                          : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                      }}
                    />

                    {/* Very Thin 3D Dynamic Wand Border Stroke */}
                    <div 
                      className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-10 ${
                        isCardActive ? 'opacity-75' : 'opacity-20 sm:opacity-0 sm:group-hover:opacity-60'
                      }`}
                      style={getWandStrokeStyle(isCardActive)}
                    />

                    {/* Wand Stardust Particle Trail */}
                    <div 
                      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 z-0 overflow-hidden ${
                        isCardActive ? 'opacity-100' : 'opacity-30 sm:opacity-0 sm:group-hover:opacity-100'
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

                    <div className="relative z-20 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                          {step.num}
                        </span>
                        <span className={`text-xs uppercase tracking-widest ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                          {step.phase}
                        </span>
                      </div>
                      <h5 className="text-base font-semibold leading-snug group-hover:text-cyan-500 transition-colors duration-300">
                        {step.title}
                      </h5>
                      <p className={`text-sm font-normal leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        <Footer />
      </div>
    </div>
  );
}