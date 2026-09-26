import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutSection() {
  const canvasRef = useRef(null);
  const { isLight, lang } = useStudioTheme();
  const isEn = lang === 'en';

  // Dynamic SEO: title & meta description per language
  useEffect(() => {
    document.title = isEn
      ? 'SIAWSH Studio | Architectural Visualisation, CGI Production & Brand Identity'
      : 'استودیو سیاوش | رندر معماری، CGI سینماتیک و هویت بصری برند';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        isEn
          ? 'SIAWSH Studio is an international multidisciplinary practice — cinematic architectural visualisation, photorealistic CGI, 3D motion design, and brand identity systems. Commission a project or collaborate.'
          : 'استودیو سیاوش، مجموعه‌ای چندرشته‌ای در طراحی معماری، رندر سینماتیک، CGI، موشن دیزاین سه‌بعدی و هویت بصری برند. سفارش پروژه و همکاری با طراحان و معماران.'
      );
    }
  }, [isEn]);

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
              {isEn ? 'SIAWSH STUDIO' : 'استودیو سیاوش'}
            </span>
            
            <h1 className={`text-2xl md:text-3xl font-normal tracking-tight leading-tight ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn 
                ? 'Where Architecture, Cinema & Brand Worlds Converge' 
                : 'جایی که معماری، سینما و جهانِ برند به هم می‌رسند'}
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
              {isEn 
                ? 'About SIAWSH Studio — The Intersection of Architectural Design, Cinematic CGI, Brand Strategy & Motion Design' 
                : 'درباره استودیو سیاوش — تلاقی طراحی معماری، رندر سینماتیک، CGI، استراتژی برند و موشن دیزاین'}
            </h2>

            <div className={`space-y-6 text-base md:text-lg font-normal leading-relaxed pt-4 ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? (
                <>
                  <p>
                    SIAWSH Studio is an international, multidisciplinary creative practice led by Siavash Afsari, operating at the intersection of architectural design, 3D visualisation, cinematic CGI, brand strategy, and motion design. Our team architects cohesive visual languages that transcend traditional platforms.
                  </p>
                  <p>
                    We believe a visual identity is not a static logo system — it is a living brand ecosystem: one that moves seamlessly across architectural environments, cinematic productions, photorealistic CGI, commercial motion graphics, bespoke furniture, and digital products. Every commission is approached through holistic art direction, architectural insight, and uncompromising visual fidelity — pairing tactile material authenticity and geometric precision with cutting-edge digital pipelines.
                  </p>
                  <p>
                    The result: scalable, high-impact brand worlds designed for both the physical and digital realms — empowering visionary architecture firms, global brands, tech innovators, and film productions to transform ambitious ideas into enduring visual assets.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    استودیو سیاوش یک مجموعه تخصصی و چندرشته‌ای به مدیریت سیاوش افسری است؛ در نقطه‌ی تلاقی طراحی معماری، رندر سه‌بعدی، CGI سینماتیک، استراتژی برند و موشن دیزاین. تیم ما «زبان‌های بصری» منسجمی خلق می‌کند که از مرز یک پلتفرم فراتر می‌روند.
                  </p>
                  <p>
                    ما باور داریم هویت بصری یک سیستم ثابت یا صرفاً یک لوگو نیست؛ بلکه یک اکوسیستم زنده است — کیفیتی که به‌طور یکپارچه در فضاهای معماری، تولیدات سینمایی، CGI فوتورئال، موشن گرافیک تبلیغاتی، مبلمان سفارشی و محصولات دیجیتال جاری می‌شود. هر پروژه از دریچه‌ی کارگردانی بصری همه‌جانبه، نگاه معمارانگی و کیفیت تصویری بی‌تعارض دنبال می‌شود؛ با تلفیق اصالت متریال و دقت هندسی با جدیدترین پایپ‌لاین‌های دیجیتال.
                  </p>
                  <p>
                    نتیجه: جهان‌های برندی مقیاس‌پذیر و اثرگذار برای هر دو بستر فیزیکی و دیجیتال — به‌گونه‌ای که دفاتر معماری پیشرو، برندهای جهانی، استارتاپ‌های فناوری و پروژه‌های سینمایی بتوانند ایده‌های جسورانه‌ی خود را به دارایی‌های بصری ماندگار تبدیل کنند.
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
              {isEn ? 'STUDIO SCALE & GLOBAL REACH' : 'مقیاس استودیو و گستره جهانی'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  value: isEn ? '10+ Years' : '۱۰+ سال',
                  label: isEn ? 'Experience' : 'تجربه',
                  desc: isEn 
                    ? 'Multidisciplinary design leadership across digital media, CGI, and architectural design.' 
                    : 'رهبری طراحی چندرشته‌ای در رسانه‌های دیجیتال، CGI و طراحی معماری',
                },
                {
                  value: isEn ? '40+ Projects' : '۴۰+ پروژه',
                  label: isEn ? 'Delivered' : 'تحویل‌شده',
                  desc: isEn 
                    ? 'High-profile international commissions delivered across Europe, Cyprus, and global markets.' 
                    : 'پروژه‌های شاخص بین‌المللی در اروپا، قبرس و بازارهای جهانی',
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

          {/* Collaboration Section — New Phase */}
          <div className={`space-y-8 ${isEn ? 'text-left' : 'text-right'}`}>
            <h3 className={`text-lg md:text-xl font-normal uppercase tracking-widest ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'A STUDIO BUILT FOR COLLABORATION' : 'استودیویی برای همکاری'}
            </h3>

            <div className={`max-w-4xl space-y-6 text-base md:text-lg font-normal leading-relaxed ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? (
                <>
                  <p>
                    As SIAWSH Studio enters its next chapter, we are actively expanding our creative network — partnering with independent designers, developers, architects, art directors, and production specialists worldwide. Whether you are an architect seeking cinematic 3D visualisation for an unbuilt project, a developer or agency looking for a 3D web experience or motion identity, a brand or creative director in need of CGI-driven campaign content, or a designer interested in co-production — we provide the pipeline, the craft, and the vision.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    استودیو سیاوش در فاز تازه‌ای از فعالیت خود، شبکه‌ی خلاقانه‌ی خود را گسترش می‌دهد و با طراحان مستقل، توسعه‌دهندگان وب، معماران، کارگردانان هنری و متخصصان تولید در سراسر جهان همکاری می‌کند. چه معماری باشید که به رندر سینماتیک و بازنمایی سه‌بعدی پروژه‌ی در دست طراحی یا ساخت خود نیاز دارد، چه توسعه‌دهنده یا آژانسی در جست‌وجوی تجربه‌ی وب سه‌بعدی یا هویت متحرک برند، چه مدیر خلاقیتی که به محتوای CGI کمپین خود فکر می‌کند، و چه طراح یا استودیویی که خواهان هم‌تولیدی است — ما پایپ‌لاین، مهارت و چشم‌انداز را در کنار شما فراهم می‌کنیم. اگر پروژه‌ای جاه‌طلبانه دارید، بیایید جهان آن را با هم بسازیم.
                  </p>
                </>
              )}
            </div>

            {/* Collaboration Audience Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(isEn ? [
                {
                  num: '01',
                  title: 'Architects & Studios',
                  desc: 'Cinematic 3D visualisation and CGI storytelling for unbuilt and under-construction projects.',
                },
                {
                  num: '02',
                  title: 'Developers & Agencies',
                  desc: 'Immersive 3D web experiences, motion identities, and interactive product showcases.',
                },
                {
                  num: '03',
                  title: 'Brands & Creative Directors',
                  desc: 'CGI-driven campaign content, kinetic identity systems, and commercial teasers.',
                },
                {
                  num: '04',
                  title: 'Designers & Production Partners',
                  desc: 'Co-production, white-label collaboration, and shared pipelines for ambitious work.',
                },
              ] : [
                {
                  num: '۰۱',
                  title: 'معماران و دفاتر معماری',
                  desc: 'رندر سینماتیک سه‌بعدی و روایت CGI برای پروژه‌های در دست طراحی یا ساخت.',
                },
                {
                  num: '۰۲',
                  title: 'توسعه‌دهندگان و آژانس‌ها',
                  desc: 'تجربه‌های وب سه‌بعدی، هویت‌های متحرک و شوکیس‌های تعاملی محصول.',
                },
                {
                  num: '۰۳',
                  title: 'برندها و مدیران خلاقیت',
                  desc: 'محتوای CGI کمپین‌ها، سیستم‌های هویت متحرک و تیزرهای تبلیغاتی.',
                },
                {
                  num: '۰۴',
                  title: 'طراحان و شرکای تولید',
                  desc: 'هم‌تولیدی، همکاری وایت‌لیبل و پایپ‌لاین مشترک برای پروژه‌های جاه‌طلبانه.',
                },
              ]).map((item, index) => {
                const cardId = `collab-${index}`;
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
                      <span className={`text-sm font-semibold block ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>
                        {item.num}
                      </span>
                      <h4 className="text-base font-semibold leading-snug group-hover:text-cyan-500 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className={`text-sm font-normal leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Collaboration CTA */}
            <div className={`pt-4 ${isEn ? 'text-left' : 'text-right'}`}>
              <a
                href="/contact"
                className={`inline-flex items-center gap-2 border px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-500 hover:-translate-y-0.5 ${
                  isLight
                    ? 'border-black/20 text-black hover:border-cyan-600 hover:text-cyan-600'
                    : 'border-white/20 text-white hover:border-cyan-400 hover:text-cyan-400'
                }`}
              >
                {isEn ? 'Start a Collaboration →' : 'شروع همکاری ←'}
              </a>
            </div>
          </div>

          {/* Core Capabilities Cards */}
          <div className={`space-y-12 ${isEn ? 'text-left' : 'text-right'}`}>
            <h3 className={`text-lg md:text-xl font-normal uppercase tracking-widest ${
              isEn ? 'font-sans' : "font-['Vazirmatn','Vazir',sans-serif]"
            } ${
              isLight ? 'text-black/70' : 'text-white/70'
            }`}>
              {isEn ? 'CORE CAPABILITIES' : 'توانمندی‌های اصلی'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(isEn ? [
                {
                  num: '01',
                  category: 'Architecture & Render',
                  title: 'Architectural Design, Spatial Planning & 3D Visualisation',
                  desc: 'High-end architectural design, spatial layout planning, photorealistic 3D visualisation, interior styling, and environmental landscaping.',
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
                  desc: 'Interactive web interfaces, digital editorial platforms, and immersive 3D web experiences designed in Figma and built for modern high-performance web frameworks.',
                  outcomes: ['Web UI/UX Interfaces', 'Interactive 3D Web Models', 'Functional Web Prototypes'],
                },
              ] : [
                {
                  num: '۰۱',
                  category: 'معماری و رندر',
                  title: 'طراحی معماری، دکوراسیون داخلی و رندر سه‌بعدی',
                  desc: 'طراحی معماری سطح‌بالا، جانمایی فضایی، رندر فوتورئال سه‌بعدی معماری، استایل‌دهی داخلی و طراحی منظر و فضای سبز.',
                  outcomes: ['کانسپت فضایی معماری', 'رندرهای سینماتیک سه‌بعدی', 'مستندات فنی CAD'],
                },
                {
                  num: '۰۲',
                  category: 'سینما و CGI',
                  title: 'کارگردانی سینمایی، جلوه‌های بصری (VFX) و تولید CGI',
                  desc: 'جلوه‌های ویژه (VFX) با کیفیت بالا، رندرلوپ‌های سینماتیک CGI، کوریوگرافی حرکتی پیچیده، تدوین و تصحیح رنگ سینمایی برای کمپین‌های تبلیغاتی و برندهای لوکس.',
                  outcomes: ['سکانس‌های CGI و VFX', 'تیزرهای سینماتیک تبلیغاتی', 'تصحیح رنگ گره‌محور'],
                },
                {
                  num: '۰۳',
                  category: 'طراحی صنعتی',
                  title: 'طراحی مبلمان سفارشی و طراحی صنعتی محصول',
                  desc: 'طراحی صنعتی سرتاسری، کانسپت مبلمان سفارشی، نقشه‌های فنی ساخت، کیوریشن متریال و نمونه‌سازی سه‌بعدی.',
                  outcomes: ['کانسپت مبلمان سفارشی', 'نمونه‌سازی مقیاس‌شده', 'شیت‌های فنی ساخت'],
                },
                {
                  num: '۰۴',
                  category: 'هویت بصری برند',
                  title: 'استراتژی برند و سیستم‌های هویت متحرک',
                  desc: 'طراحی جامع هویت بصری برند، معماری برند، سیستم‌های برندینگ متحرک، طراحی لوگوی کینتیک و کارگردانی خلاقانه.',
                  outcomes: ['راهنمای سبک برند (برندبوک)', 'سیستم‌های لوگوی کینتیک', 'دیزاین سیستم‌ها'],
                },
                {
                  num: '۰۵',
                  category: 'موشن دیزاین سه‌بعدی',
                  title: 'موشن گرافیک سه‌بعدی و انیمیشن CGI محصول',
                  desc: 'انیمیشن‌های فوتورئال سه‌بعدی محصول، موشن گرافیک پویا، شوکیس‌های وب و استوری‌بورد انیماتیک؛ ساخته‌شده با Blender، DaVinci Resolve و After Effects.',
                  outcomes: ['انیمیشن سه‌بعدی محصول', 'تیزرهای تبلیغاتی متحرک', 'دارایی‌های تایپوگرافی کینتیک'],
                },
                {
                  num: '۰۶',
                  category: 'محصول دیجیتال',
                  title: 'طراحی محصول دیجیتال و مهندسی UI/UX',
                  desc: 'رابط‌های کاربری تعاملی، پلتفرم‌های تحریریه دیجیتال و تجربه‌های وب سه‌بعدی؛ طراحی‌شده در Figma و ساخته‌شده برای فریم‌ورک‌های مدرن و پرسرعت وب.',
                  outcomes: ['رابط‌های UI/UX وب', 'مدل‌های سه‌بعدی تعاملی وب', 'پروتوتایپ‌های کاربردی'],
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
              {isEn ? 'TOOLING & TECHNOLOGY ECOSYSTEM' : 'زیست‌بوم ابزارها و فناوری'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  category: isEn ? 'Specialized Tooling' : 'ابزار تخصصی',
                  title: isEn ? 'Cinema, Motion & 3D Pipeline' : 'پایپ‌لاین سینما، موشن و سه‌بعدی',
                  tools: 'Blender / Adobe After Effects / DaVinci Resolve / VFX & Generative AI Tools',
                },
                {
                  category: isEn ? 'Specialized Tooling' : 'ابزار تخصصی',
                  title: isEn ? 'Brand & Visual Design' : 'طراحی برند و بصری',
                  tools: 'Figma / Photoshop / Illustrator / Adobe Audition',
                },
                {
                  category: isEn ? 'Specialized Tooling' : 'ابزار تخصصی',
                  title: isEn ? 'Web Engineering & Frontend' : 'مهندسی وب و فرانت‌اند',
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
              {isEn ? 'CREATIVE PIPELINE' : 'فرایند خلق اثر'}
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
                  title: 'کشف، کانسپت و استوری‌بورد',
                  desc: 'تحقیق بصری، طراحی روایت، پیش‌نویس کانسپت، استوری‌بورد پویا و ریتم‌بندی فضا و حرکت برای تعریف چشم‌انداز خلاقانه.',
                },
                {
                  num: '۰۲',
                  phase: '',
                  title: 'بلاک‌اوت سه‌بعدی و ساخت انیماتیک',
                  desc: 'مدل‌سازی ساختاری سه‌بعدی در Blender، کارگردانی دوربین، هم‌ترازی زمانی و پیش‌نمایش انیماتیک برای تأیید کارفرما.',
                },
                {
                  num: '۰۳',
                  phase: '',
                  title: 'متریال PBR، نورپردازی و شبیه‌سازی',
                  desc: 'تکسچرینگ مبتنی بر فیزیک (PBR)، نورپردازی سینماتیک، شبیه‌سازی پارچه و ذرات و رندرهای آزمایشی.',
                },
                {
                  num: '۰۴',
                  phase: '',
                  title: 'گریدینگ، مسترینگ صدا و خروجی نهایی',
                  desc: 'رندر CGI با وضوح بالا، تصحیح رنگ گره‌محور در DaVinci Resolve، طراحی صدای فضایی در Adobe Audition و خروجی بهینه چندپلتفرمی.',
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