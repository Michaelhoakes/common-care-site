"use client";

import { useState, useRef, useEffect } from "react";
import GreenDotLottie from "./GreenDotLottie";

const LINE_DURATION_MS = 2800;
const LINE_DELAY_MS = 200;

export default function IsThisForMeSection() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      hasScrolledRef.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!hasScrolledRef.current || !entry.isIntersecting) return;
        const { top } = entry.boundingClientRect;
        const triggerZone = window.innerHeight * 0.85;
        if (top <= triggerZone) setVisible(true);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const show = visible || reducedMotion;

  return (
    <section
      id="is-this-for-me"
      ref={sectionRef}
      className="relative py-32 md:py-40 bg-pistachio-light overflow-hidden"
    >
      {/* Gradient overlay — same family, overlapping and dramatic */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 80% 20%, rgba(143, 168, 92, 0.55) 0%, rgba(143, 168, 92, 0.2) 40%, transparent 70%),
            radial-gradient(ellipse 90% 70% at 15% 80%, rgba(91, 121, 68, 0.45) 0%, rgba(143, 168, 92, 0.25) 45%, transparent 70%),
            radial-gradient(ellipse 70% 100% at 50% 50%, rgba(208, 219, 174, 0.5) 0%, rgba(143, 168, 92, 0.15) 50%, transparent 75%),
            linear-gradient(145deg, rgba(208, 219, 174, 0.35) 0%, transparent 35%, rgba(91, 121, 68, 0.2) 100%)
          `,
        }}
        aria-hidden
      />
      {/* Grain texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />
      <div className="relative z-10 w-full px-6 md:px-16">
        <p
          className={`text-sm font-mono font-medium tracking-widest uppercase text-darkgreen ${
            show ? "opacity-60 translate-y-0" : "opacity-0 translate-y-[10px]"
          } ${!reducedMotion ? "transition-all duration-[1100ms] ease-out" : ""}`}
        >
          Is this for me?
        </p>
        <h2
          className={`font-hero-display tracking-normal mt-4 text-4xl md:text-5xl text-darkgreen max-w-2xl ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[12px]"
          } ${!reducedMotion ? "transition-all duration-[1100ms] ease-out" : ""}`}
          style={!reducedMotion ? { transitionDelay: visible ? "200ms" : "0ms" } : undefined}
        >
          Wherever you are, we meet you there.
        </h2>

        <div className="mt-16 relative">
          <div
            className={`absolute top-0 left-0 h-px bg-darkgreen/50 -ml-6 md:-ml-16 ${show ? "w-[calc(100%+1.5rem)] md:w-[calc(100%+128px)]" : "w-0"} ${
              !reducedMotion ? "transition-[width] ease-out" : ""
            }`}
            style={
              !reducedMotion
                ? {
                    transitionDuration: `${LINE_DURATION_MS}ms`,
                    transitionDelay: visible ? `${LINE_DELAY_MS}ms` : "0ms",
                  }
                : undefined
            }
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-8">
            {[
              {
                title: "On the path to healing",
                body: "You're navigating injury or chronic pain and need relief and rehabilitation.",
              },
              {
                title: "Rebuilding balance",
                body: "You feel imbalanced — dealing with stress, fatigue, bad sleep, or low energy. You want to feel whole again and regain control of your health.",
              },
              {
                title: "Investing in longevity",
                body: "You feel strong and want to continue investing in your long-term health and longevity.",
              },
            ].map((item, i) => (
              <div key={item.title} className="relative">
                <GreenDotLottie
                  active={false}
                  visible={show}
                  reducedMotion={!!reducedMotion}
                  className={!reducedMotion && visible ? "transition-opacity duration-300 ease-out" : ""}
                  style={!reducedMotion && visible ? { transitionDelay: `${LINE_DELAY_MS}ms` } : undefined}
                />
                <div
                  className={`${
                    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[10px]"
                  } ${!reducedMotion ? "transition-all duration-[1100ms] ease-out" : ""}`}
                  style={!reducedMotion && visible ? { transitionDelay: `${200 + 200 * i}ms` } : undefined}
                >
                  <h3 className="font-hero-display text-[24px] font-medium text-darkgreen">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[16px] opacity-80 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
