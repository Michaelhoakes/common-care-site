"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

const services = [
  {
    title: "The 360° Evaluation",
    desc: "A thorough baseline to understand how you move and where to begin.",
    image: "/images/_DSF8105.jpeg",
    href: "/care#the-360-evaluation",
  },
  {
    title: "Ongoing Care",
    desc: "60–90 minutes of focused care tailored to your goals. No rushing, no shortcuts.",
    image: "/images/_DSF8511.jpeg",
    href: "/care#the-care-sessions",
    flipX: true,
  },
  {
    title: "Everyday Wellness",
    desc: "Ongoing guidance for people who want consistency over quick fixes.",
    image: "/images/_DSF8789.jpeg",
    href: "/care#everyday-wellness",
  },
];

const PANEL_HEIGHT = 600;
const N = services.length;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t) * (1 - t);
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ServicesPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef(0);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const tick = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - PANEL_HEIGHT;
    if (scrollable <= 0) return;
    setProgress(clamp(-rect.top / scrollable, 0, 1));
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick, reducedMotion]);

  const getPanelState = useCallback(
    (i: number) => {
      const seg = 1 / N;
      const start = i * seg;
      const local = clamp((progress - start) / seg, 0, 1);

      // Image: layered stack — panel 0 always visible, later panels dissolve in on top
      let imgOpacity: number;
      if (i === 0) {
        imgOpacity = 1;
      } else {
        const fadeStart = start - 0.02;
        const fadeDuration = 0.12;
        imgOpacity = easeInOut(
          clamp((progress - fadeStart) / fadeDuration, 0, 1)
        );
      }

      // Parallax: gentle vertical drift across the segment
      const parallaxY = lerp(30, -30, local);

      // Text: staggered fade-in with upward float, fade-out before next scene
      let textOpacity: number;
      if (progress < start || progress > start + seg) {
        textOpacity = 0;
      } else if (local < 0.25) {
        textOpacity = easeOut(clamp((local - 0.06) / 0.19, 0, 1));
      } else if (i < N - 1 && local > 0.80) {
        textOpacity = 1 - easeOut(clamp((local - 0.80) / 0.15, 0, 1));
      } else {
        textOpacity = 1;
      }

      const textY =
        local < 0.25
          ? lerp(14, 0, clamp(textOpacity, 0, 1))
          : i < N - 1 && local > 0.80
          ? lerp(0, -8, clamp(1 - textOpacity, 0, 1))
          : 0;

      return { imgOpacity, parallaxY, textOpacity, textY };
    },
    [progress]
  );

  const activeIndex = Math.min(Math.floor(progress * N), N - 1);

  /* ── Shared overlays (gradient + grain) ── */
  const overlays = (
    <>
      <div className="absolute inset-0 backdrop-saturate-[0.8]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </>
  );

  return (
    <section id="services" className="pt-44 md:pt-56">
      <div className="w-full px-6 md:px-16">
        <p className="text-sm font-mono font-medium tracking-widest uppercase text-darkgreen opacity-60">
          the common care method
        </p>
        <h2 className="font-hero-display tracking-normal text-4xl md:text-5xl text-darkgreen mt-4">
          Comprehensive care — from evaluation to everyday movement.
        </h2>
      </div>

      {/* ────── Desktop: scroll-pinned parallax ────── */}
      <div
        ref={containerRef}
        className="hidden md:block relative"
        style={{ height: reducedMotion ? "auto" : "250vh", paddingTop: 64 }}
      >
        {reducedMotion ? (
          /* Reduced-motion fallback: static row, no scroll lock */
          <div className="flex w-full gap-0" style={{ height: PANEL_HEIGHT }}>
            {services.map((s, i) => (
              <div key={s.title} className="relative overflow-hidden flex-1">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${s.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: s.flipX ? "scaleX(-1)" : undefined,
                  }}
                />
                {overlays}
                <div className="absolute left-0 right-0 top-[58%] px-8">
                  <span className="text-[14px] font-medium tracking-widest uppercase text-white/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 font-hero-display text-[32px] font-medium text-white leading-[normal]">
                    {s.title}
                  </h3>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <p className="text-[16px] text-white/85 leading-relaxed max-w-md">
                      {s.desc}
                    </p>
                    <Link
                      href={s.href}
                      className="group/link inline-flex shrink-0 items-center gap-1 text-[13px] font-mono tracking-[0.22em] uppercase text-white/80 hover:text-white transition-colors"
                    >
                      <span>Learn more</span>
                      <span className="inline-block transition-transform duration-200 ease-out group-hover/link:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Parallax viewport */
          <div
            className="sticky top-0 w-full overflow-hidden"
            style={{ height: PANEL_HEIGHT }}
          >
            {services.map((s, i) => {
              const st = getPanelState(i);
              return (
                <div
                  key={s.title}
                  className="absolute inset-0"
                  style={{
                    opacity: st.imgOpacity,
                    zIndex: i + 1,
                    willChange: "opacity",
                    pointerEvents: st.textOpacity > 0.5 ? "auto" : "none",
                  }}
                >
                  {/* Background image — oversized so parallax doesn't expose edges */}
                  <div
                    className="absolute left-0 right-0"
                    style={{
                      top: -40,
                      bottom: -40,
                      backgroundImage: `url(${s.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: `${s.flipX ? "scaleX(-1) " : ""}translateY(${st.parallaxY}px)`,
                      willChange: "transform",
                    }}
                  />

                  {overlays}

                  {/* Text block */}
                  <div
                    className="absolute left-0 right-0 top-[58%] px-16"
                    style={{
                      opacity: st.textOpacity,
                      transform: `translateY(${st.textY}px)`,
                      willChange: "opacity, transform",
                    }}
                  >
                    <span className="text-[14px] font-medium tracking-widest uppercase text-white/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 font-hero-display text-[32px] font-medium text-white leading-[normal]">
                      {s.title}
                    </h3>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <p className="text-[16px] text-white/85 leading-relaxed max-w-md">
                        {s.desc}
                      </p>
                      <Link
                        href={s.href}
                        className="group/link inline-flex shrink-0 items-center gap-1 text-[13px] font-mono tracking-[0.22em] uppercase text-white/80 hover:text-white transition-colors"
                      >
                        <span>Learn more</span>
                        <span className="inline-block transition-transform duration-200 ease-out group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Progress dots — right side */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
              {services.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIndex ? 7 : 6,
                    height: i === activeIndex ? 7 : 6,
                    backgroundColor:
                      i === activeIndex
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ────── Mobile: static stack (unchanged) ────── */}
      <div className="flex flex-col w-full md:hidden mt-12 gap-0">
        {services.map((s, i) => {
          return (
            <div
              key={s.title}
              className="relative overflow-hidden h-[340px]"
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 backdrop-saturate-[0.8]" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 px-6 pt-16 pb-8">
                <span className="text-[14px] font-medium tracking-widest uppercase text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-hero-display text-[32px] font-medium text-white leading-[normal]">
                  {s.title}
                </h3>
                <div className="mt-3 flex flex-col items-start gap-2">
                  <p className="text-sm text-white/85 leading-relaxed">
                    {s.desc}
                  </p>
                  <Link
                    href={s.href}
                    className="group/link inline-flex shrink-0 items-center gap-1 text-[13px] font-mono tracking-[0.22em] uppercase text-white/80 hover:text-white transition-colors"
                  >
                    <span>Learn more</span>
                    <span className="inline-block transition-transform duration-200 ease-out group-hover/link:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom spacing */}
      <div className="pb-44 md:pb-56" />
    </section>
  );
}
