"use client";

import { useRef } from "react";
import { useEditorialImageParallax } from "../hooks/useEditorialImageParallax";

/**
 * Full-bleed background for “What makes us different” — same art direction as server section.
 */
export default function HomeBrownParallaxPicture() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);

  useEditorialImageParallax(wrapRef, motionRef, {
    parallaxFactor: 0.045,
    maxOffsetPx: 48,
    lerp: 0.12,
    scale: 1.05,
  });

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <div ref={motionRef} className="absolute -inset-[12%] min-h-0 min-w-0">
        <picture className="block h-full min-h-full w-full">
          <source media="(min-width: 1024px)" srcSet="/images/Brown-d.jpg" />
          <img
            src="/images/Brown-m.jpg"
            alt=""
            className="h-full min-h-full w-full object-cover"
          />
        </picture>
      </div>
    </div>
  );
}
