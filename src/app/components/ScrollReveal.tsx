"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Fraction of element that must be visible to trigger (0–1). Default 0.12 */
  threshold?: number;
  /** Root margin e.g. "0px 0px -60px 0px" to trigger slightly before in view */
  rootMargin?: string;
}

export default function ScrollReveal({
  children,
  className = "",
  threshold = 0.12,
  rootMargin = "0px 0px -40px 0px",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal w-full min-w-0 ${inView ? "scroll-reveal-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
