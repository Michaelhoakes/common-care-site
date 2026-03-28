"use client";

import { useRef } from "react";
import { useEditorialImageParallax } from "../hooks/useEditorialImageParallax";

export default function HomeHeroParallaxBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);

  useEditorialImageParallax(wrapRef, motionRef, {
    parallaxFactor: 0.04,
    maxOffsetPx: 42,
    lerp: 0.11,
    scale: 1.05,
  });

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <div ref={motionRef} className="absolute -inset-[10%] min-h-0 min-w-0">
        <picture className="block h-full min-h-full w-full">
          <source media="(max-width: 767px)" srcSet="/images/Hero-m.jpg" />
          <img
            src="/images/gradient-1.png"
            alt=""
            className="h-full min-h-full w-full object-cover"
            aria-hidden
          />
        </picture>
      </div>
    </div>
  );
}
