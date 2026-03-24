"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type CareSidebarProgress = {
  /** Per-section fill 0–1: prior sections 1, current partial, future 0 */
  fills: number[];
  /** Index of the section currently receiving scroll progress */
  activeIndex: number;
  activeId: string;
};

const EPS = 1e-4;

function clamp01(v: number): number {
  if (v <= 0) return 0;
  if (v >= 1) return 1;
  return v;
}

/**
 * Reading-line progress through a section (viewport coordinates).
 * 0 when the line is at/above the section top, 1 at/below the section bottom.
 */
function rawProgressThroughSection(el: HTMLElement, readingY: number): number {
  const rect = el.getBoundingClientRect();
  const h = rect.height;
  if (h <= EPS) return 0;
  return clamp01((readingY - rect.top) / h);
}

/**
 * Sequential fills: sections before the first incomplete stay at 1;
 * the first incomplete gets raw progress; later sections stay 0.
 * If every section is past, all fills are 1.
 */
export function computeSequentialFills(
  progresses: number[]
): { fills: number[]; star: number } {
  const n = progresses.length;
  let star = n;
  for (let i = 0; i < n; i++) {
    if (progresses[i] < 1 - EPS) {
      star = i;
      break;
    }
  }
  const fills = new Array<number>(n);
  if (star === n) {
    for (let i = 0; i < n; i++) fills[i] = 1;
    return { fills, star: n - 1 };
  }
  for (let i = 0; i < n; i++) {
    if (i < star) fills[i] = 1;
    else if (i === star) fills[i] = progresses[i];
    else fills[i] = 0;
  }
  return { fills, star };
}

function subscribeMediaQuery(query: string, cb: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => subscribeMediaQuery(query, onChange),
    () => window.matchMedia(query).matches,
    () => false
  );
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => subscribeReducedMotion(onChange),
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

type Options = {
  enabled: boolean;
  /** Reading line as a fraction of viewport height from the top (0–1) */
  readingLineRatio?: number;
  /** Coarser fills when true (less motion / fewer updates) */
  reduceMotion?: boolean;
};

/**
 * Derives sequential section progress from scroll + section geometry.
 * Intended for desktop; set `enabled: false` to skip listeners (e.g. mobile).
 */
export function useCareSidebarProgress(
  sectionIds: readonly string[],
  getSectionEl: (id: string) => HTMLElement | null,
  options: Options
): CareSidebarProgress {
  const { enabled, readingLineRatio = 0.36, reduceMotion = false } = options;
  const getElRef = useRef(getSectionEl);
  getElRef.current = getSectionEl;

  const idsKey = sectionIds.join("\0");

  const [state, setState] = useState<CareSidebarProgress>(() => ({
    fills: sectionIds.map(() => 0),
    activeIndex: 0,
    activeId: sectionIds[0] ?? "",
  }));

  const lastKey = useRef("");

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      lastKey.current = "";
      setState({
        fills: sectionIds.map(() => 0),
        activeIndex: 0,
        activeId: sectionIds[0] ?? "",
      });
      return;
    }

    let raf = 0;

    const tick = () => {
      const vh = window.innerHeight;
      const readingY = vh * readingLineRatio;
      const progresses = sectionIds.map((id) => {
        const el = getElRef.current(id);
        return el ? rawProgressThroughSection(el, readingY) : 0;
      });
      const { fills, star } = computeSequentialFills(progresses);

      let displayFills = fills;
      if (reduceMotion) {
        displayFills = fills.map((f) => {
          if (f >= 1 - EPS) return 1;
          if (f <= EPS) return 0;
          return Math.round(f * 4) / 4;
        });
      }

      const activeIndex = star;
      const activeId = sectionIds[activeIndex] ?? sectionIds[0] ?? "";

      const key = `${activeId}|${displayFills.map((f) => f.toFixed(3)).join(",")}`;
      if (key !== lastKey.current) {
        lastKey.current = key;
        setState({
          fills: displayFills,
          activeIndex,
          activeId,
        });
      }
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    tick();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(raf);
    };
  }, [enabled, readingLineRatio, reduceMotion, idsKey]);

  if (!enabled || sectionIds.length === 0) {
    return {
      fills: sectionIds.map(() => 0),
      activeIndex: 0,
      activeId: sectionIds[0] ?? "",
    };
  }

  return state;
}
