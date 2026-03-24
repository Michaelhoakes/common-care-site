"use client";

import { useEffect, useRef } from "react";

/**
 * Sets `--care-scroll-y` from window scroll for `.care-parallax-media` /
 * `.care-parallax-hero` (used on /care, /first-visit, etc.).
 */
export function useCareParallaxScrollY() {
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document.documentElement.style.setProperty("--care-scroll-y", "0px");
      return;
    }

    const apply = () => {
      document.documentElement.style.setProperty(
        "--care-scroll-y",
        `${window.scrollY}px`
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
      document.documentElement.style.setProperty("--care-scroll-y", "0px");
    };
  }, []);
}
