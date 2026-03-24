"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const DEFAULT_SLIDES = [
  {
    src: "/images/exbody.jpg",
    alt: "InBody-style body composition readout and analysis context",
  },
  {
    src: "/images/treatment2.jpg",
    alt: "Hands-on clinical assessment and treatment",
  },
  {
    src: "/images/treatmenttable2.jpg",
    alt: "Treatment table and one-on-one care environment",
  },
] as const;

type CarouselSlide = {
  src: string;
  alt: string;
};

export default function CareEvaluationCarousel({
  slides = DEFAULT_SLIDES,
  ariaLabel = "Evaluation imagery",
}: {
  slides?: readonly CarouselSlide[];
  ariaLabel?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const scrollToIndex = useCallback((next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const len = slides.length;
    const clamped = ((next % len) + len) % len;
    const w = el.offsetWidth;
    el.scrollTo({
      left: clamped * w,
      behavior: reduceMotionRef.current ? "auto" : "smooth",
    });
    setIndex(clamped);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const cur = Math.max(0, Math.round(el.scrollLeft / w));
    scrollToIndex(cur - 1);
  }, [scrollToIndex]);

  const goNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const cur = Math.max(0, Math.round(el.scrollLeft / w));
    scrollToIndex(cur + 1);
  }, [scrollToIndex]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let t: ReturnType<typeof setTimeout> | null = null;
    const debounced = () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        const w = el.offsetWidth;
        if (w <= 0) return;
        const i = Math.round(el.scrollLeft / w);
        if (i >= 0 && i < slides.length) {
          setIndex((prev) => (prev !== i ? i : prev));
        }
      }, 80);
    };

    el.addEventListener("scroll", debounced, { passive: true });
    return () => {
      if (t) clearTimeout(t);
      el.removeEventListener("scroll", debounced);
    };
  }, [slides.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.offsetWidth;
      if (w <= 0) return;
      el.scrollTo({ left: index * w, behavior: "auto" });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div
      className="relative mt-10 mb-10 w-full max-w-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl bg-forest/[0.03] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live="polite"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="w-full min-w-full shrink-0 snap-center"
          >
            <div className="relative aspect-[21/9] min-h-[200px] w-full sm:aspect-[2/1] md:min-h-[280px]">
              <img
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1400px) 1400px, 100vw"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-2 top-2 z-10 sm:right-3 sm:top-3">
        <div className="pointer-events-auto flex flex-row items-center gap-1 rounded-lg bg-white/70 p-1.5 shadow-sm ring-1 ring-forest/10 backdrop-blur-sm">
          <button
            type="button"
            onClick={goPrev}
            className="flex h-9 w-9 items-center justify-center rounded-md text-forest transition-colors hover:bg-forest/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha/50"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex h-9 w-9 items-center justify-center rounded-md text-forest transition-colors hover:bg-forest/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha/50"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
