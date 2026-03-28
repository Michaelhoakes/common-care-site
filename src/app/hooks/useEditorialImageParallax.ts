"use client";

import { useEffect, useRef, type RefObject } from "react";

export type EditorialParallaxOptions = {
  parallaxFactor?: number;
  maxOffsetPx?: number;
  lerp?: number;
  scale?: number;
  disableBelowWidth?: number;
};

const DEFAULT_PARALLAX_FACTOR = 0.05;
const DEFAULT_MAX_OFFSET = 48;
const DEFAULT_LERP = 0.12;
const DEFAULT_SCALE = 1.05;
const DEFAULT_DISABLE_WIDTH = 768;

/**
 * Subtle scroll-linked translateY + scale on a full-bleed image.
 * RAF smoothing; disabled for prefers-reduced-motion or below breakpoint.
 */
export function useEditorialImageParallax(
  wrapRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  {
    parallaxFactor = DEFAULT_PARALLAX_FACTOR,
    maxOffsetPx = DEFAULT_MAX_OFFSET,
    lerp = DEFAULT_LERP,
    scale = DEFAULT_SCALE,
    disableBelowWidth = DEFAULT_DISABLE_WIDTH,
  }: EditorialParallaxOptions = {}
) {
  const smoothedRef = useRef(0);
  const rafRef = useRef(0);
  const runningRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const el = targetRef.current;
    if (!wrap || !el) return;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia(
      `(max-width: ${disableBelowWidth - 1}px)`
    );

    const isDisabled = () =>
      reduceMq.matches || mobileMq.matches;

    const clear = () => {
      smoothedRef.current = 0;
      el.style.willChange = "auto";
      el.style.transform = "";
    };

    const step = () => {
      rafRef.current = 0;

      if (isDisabled()) {
        clear();
        runningRef.current = false;
        return;
      }

      el.style.willChange = "transform";

      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerY = rect.top + rect.height / 2;
      const viewportMid = vh / 2;
      let target = (centerY - viewportMid) * parallaxFactor;
      target = Math.max(-maxOffsetPx, Math.min(maxOffsetPx, target));

      const smoothed =
        smoothedRef.current + (target - smoothedRef.current) * lerp;
      smoothedRef.current = smoothed;

      el.style.transform = `translate3d(0, ${smoothed}px, 0) scale(${scale})`;

      if (Math.abs(target - smoothed) > 0.04) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        runningRef.current = false;
      }
    };

    const kick = () => {
      if (isDisabled()) {
        clear();
        return;
      }
      if (!runningRef.current) {
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(step);
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const onScroll = () => kick();
    const onResize = () => kick();
    const onMq = () => kick();

    reduceMq.addEventListener("change", onMq);
    mobileMq.addEventListener("change", onMq);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    kick();

    return () => {
      reduceMq.removeEventListener("change", onMq);
      mobileMq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      clear();
      runningRef.current = false;
    };
  }, [
    wrapRef,
    targetRef,
    parallaxFactor,
    maxOffsetPx,
    lerp,
    scale,
    disableBelowWidth,
  ]);
}
