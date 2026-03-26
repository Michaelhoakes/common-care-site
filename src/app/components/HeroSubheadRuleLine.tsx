"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Horizontal rule from the subhead column’s left edge to the viewport’s right edge. */
export default function HeroSubheadRuleLine() {
  const startRef = useRef<HTMLSpanElement>(null);
  const [widthPx, setWidthPx] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = startRef.current;
    if (!el) return;

    const measure = () => {
      const left = el.getBoundingClientRect().left;
      setWidthPx(Math.max(0, window.innerWidth - left));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="relative mb-6 min-h-px overflow-visible">
      <span
        ref={startRef}
        className="pointer-events-none absolute left-0 top-0 block h-0 w-0"
        aria-hidden
      />
      <div
        className="hero-subhead-line pointer-events-none absolute left-0 top-0 h-px bg-white/40"
        style={{ width: widthPx ?? "100%" }}
        aria-hidden
      />
    </div>
  );
}
