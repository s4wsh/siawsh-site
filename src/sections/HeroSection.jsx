import React, { useMemo } from "react";
import { useStudioTheme } from "../context/ThemeContext.jsx";

/* Shared surface colors: must match SelectedPractices + index.css (--surface-spatial) */
const SURFACE_LIGHT = "232,237,244"; // #e8edf4 (blue-gray)
const SURFACE_DARK = "11,11,13"; // #0b0b0d

/* Eased gradient (smoother than a 3-stop linear one) */
const easedFade = (rgb) =>
  `linear-gradient(to top,
    rgba(${rgb},1) 0%,
    rgba(${rgb},1) 4%,
    rgba(${rgb},0.92) 14%,
    rgba(${rgb},0.78) 28%,
    rgba(${rgb},0.58) 44%,
    rgba(${rgb},0.36) 60%,
    rgba(${rgb},0.16) 78%,
    rgba(${rgb},0.04) 92%,
    rgba(${rgb},0) 100%)`;

export default function HeroSection() {
  const { mode, t, isLight } = useStudioTheme();

  const heroConfig = useMemo(
    () => ({
      spatial: {
        desktopImage: "/images/hero-spatial.webp",
        mobileImage: "/images/hero-spatial-mobile.webp",
        alt: t.hero.spatialAlt,
        desktopPosition: "50% 50%",
        mobilePosition: "85% 5%",
      },
      cinematic: {
        desktopImage: "/images/hero_cinematic.webp",
        mobileImage: "/images/hero_cinematic_mobile.webp",
        alt: t.hero.cinematicAlt,
        desktopPosition: "50% 50%",
        mobilePosition: "center 30%",
      },
    }),
    [t.hero.cinematicAlt, t.hero.spatialAlt]
  );

  const currentHero = heroConfig[mode] || heroConfig.spatial;

  const title = mode === "spatial" ? t.hero.titleSpatial : t.hero.titleCinematic;
  const badge = mode === "spatial" ? t.hero.badgeSpatial : t.hero.badgeCinematic;
  const disciplines =
    mode === "spatial"
      ? t.hero.disciplinesValueSpatial || t.hero.disciplinesValue
      : t.hero.disciplinesValueCinematic || t.hero.disciplinesValue;

  const surfaceRgb = isLight ? SURFACE_LIGHT : SURFACE_DARK;
  const surfaceSolid = `rgb(${surfaceRgb})`;

  const theme = isLight
    ? {
        text: "text-[#1a1a1a]",
        muted: "text-[#1a1a1a]/85 font-medium",
        subtle: "text-[#1a1a1a]/75",
        border: "border-black/10",
        divider: "bg-black/10",
        gridDivider: "divide-black/10",
        glass:
          "bg-white/10 backdrop-blur-md border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]",
        glassHover: "hover:bg-white/20",
      }
    : {
        text: "text-[#f0f0f3]",
        muted: "text-[#f0f0f3]/85",
        subtle: "text-[#f0f0f3]/65",
        border: "border-white/10",
        divider: "bg-white/10",
        gridDivider: "divide-white/10",
        glass:
          "bg-[#16161a]/40 backdrop-blur-md border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]",
        glassHover: "hover:bg-[#16161a]/60",
      };

  return (
    <header
      id="hero"
      style={{ backgroundColor: surfaceSolid }}
      className={[
        "relative isolate w-full font-['Vazirmatn',sans-serif]",
        "min-h-0 md:min-h-[100dvh]",
        "flex flex-col justify-between",
        "-mb-px",
        "transition-colors duration-500",
      ].join(" ")}
    >
      {/* 1. DESKTOP BACKGROUND */}
      <div
        className="hidden md:block absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          <img
            key={`desktop-${mode}`}
            src={currentHero.desktopImage}
            alt={currentHero.alt}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            style={{ objectPosition: currentHero.desktopPosition }}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
          />
          <div
            className="absolute inset-x-0 -bottom-px h-[55%] transition-all duration-500"
            style={{ backgroundImage: easedFade(surfaceRgb) }}
          />
        </div>
      </div>

      {/* 2. MOBILE BACKGROUND */}
      <div className="block md:hidden absolute inset-x-0 top-0 h-[58vh] z-0 pointer-events-none">
        <div className="sticky top-0 h-[58vh] w-full overflow-hidden">
          <img
            key={`mobile-${mode}`}
            src={currentHero.mobileImage}
            alt={currentHero.alt}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            style={{ objectPosition: currentHero.mobilePosition }}
            className="h-full w-full object-cover transition-all duration-700 ease-out"
          />
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
          <div
            className="absolute inset-x-0 -bottom-px h-[55%] transition-all duration-500"
            style={{ backgroundImage: easedFade(surfaceRgb) }}
          />
        </div>
      </div>

      {/* 3. CONTENT */}
      <div
        className={[
          "relative z-10",
          "flex flex-col justify-between flex-1",
          "w-full max-w-7xl mx-auto",
          "px-4 sm:px-6 lg:px-8",
          "pt-[38vh] md:pt-[150px]",
          "pb-6 md:pb-14",
        ].join(" ")}
      >
        <div className="hidden md:block flex-1 min-h-[160px]" />

        <div className="w-full">
          <div
            className={[
              "mb-2 md:mb-4 flex items-center gap-2",
              mode === "spatial" ? "mix-blend-difference text-white" : "",
            ].join(" ")}
          >
            <span
              className={[
                "h-[5px] w-[5px] md:h-[6px] md:w-[6px] rounded-full",
                mode === "spatial" ? "bg-white" : isLight ? "bg-[#1a1a1a]" : "bg-white",
              ].join(" ")}
            />
            <span
              className={[
                "text-xs sm:text-sm font-semibold leading-none tracking-[0.04em]",
                "transition-colors duration-500",
                mode === "spatial" ? "text-white" : theme.muted,
              ].join(" ")}
            >
              {badge}
            </span>
          </div>

          <div className="max-w-[900px]">
            <h1
              key={`${mode}-${isLight}`}
              className={[
                "font-vazirmatn font-normal tracking-tight",
                "leading-[1.45] sm:leading-[1.3] md:leading-[1.25]",
                "text-[clamp(1.15rem,2.2vw,2.5rem)]",
                "transition-colors duration-500",
                mode === "spatial" ? "mix-blend-difference text-white" : theme.text,
              ].join(" ")}
            >
              {title}
            </h1>
          </div>

          <div
            className={[
              "mt-4 md:mt-8 w-full border rounded-sm",
              "transition-all duration-500",
              theme.glass,
              theme.glassHover,
            ].join(" ")}
          >
            <div
              className={[
                "grid grid-cols-1 md:grid-cols-3",
                "divide-y md:divide-y-0 md:divide-x md:divide-x-reverse",
                theme.gridDivider,
              ].join(" ")}
            >
              <HeroMeta label={t.hero.locationLabel} value={t.hero.locationValue} theme={theme} />
              <HeroMeta label={t.hero.statusLabel} value={t.hero.statusValue} theme={theme} />
              <HeroMeta label={t.hero.disciplinesLabel} value={disciplines} theme={theme} />
            </div>
          </div>

          <div className="mt-3 sm:mt-5 flex items-center justify-between">
            <div
              className={[
                "flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.08em]",
                theme.subtle,
              ].join(" ")}
            >
              <span
                className={[
                  "h-[4px] w-[4px] rounded-full",
                  isLight ? "bg-black/50" : "bg-white/60",
                ].join(" ")}
              />
              <span className="font-mono uppercase">
                {mode === "spatial" ? "SPATIAL" : "CINEMATIC"}
              </span>
            </div>

            <div
              className={[
                "hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-[0.08em]",
                theme.subtle,
              ].join(" ")}
            >
              <span>SCROLL</span>
              <span className={["block h-8 w-px", theme.divider].join(" ")} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroMeta({ label, value, theme }) {
  return (
    <div
      className={[
        "min-w-0 px-4 py-3 sm:px-6 sm:py-5 lg:px-8 lg:py-6",
        "flex flex-col justify-center",
        theme.border,
      ].join(" ")}
    >
      <div
        className={[
          "mb-1 text-[10px] sm:text-[11px] lg:text-[12px] font-semibold tracking-[0.04em]",
          "transition-colors duration-500",
          theme.subtle,
        ].join(" ")}
      >
        {label}
      </div>
      <div
        className={[
          "font-vazirmatn text-xs sm:text-sm md:text-[14px] lg:text-[15px] font-medium leading-relaxed line-clamp-2",
          "transition-colors duration-500",
          theme.text,
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}