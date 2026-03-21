"use client";

import { useState, useEffect } from "react";

/** Fixed at bottom of viewport; hides once user scrolls so it doesn’t overlap content. */
export default function HeroScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const threshold = 80;
    const onScroll = () => setVisible(window.scrollY <= threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#services"
      className="hero-scroll-indicator fixed bottom-6 left-1/2 z-20 flex flex-col items-center text-white/60 hover:text-white/80 transition-colors pointer-events-auto"
      aria-label="Scroll to content"
    >
      <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="opacity-90" aria-hidden>
        <line x1="6" y1="0" x2="6" y2="18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M2 18l4 6 4-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="mt-2 text-[11px] font-medium tracking-widest uppercase opacity-90">Scroll down</span>
    </a>
  );
}
