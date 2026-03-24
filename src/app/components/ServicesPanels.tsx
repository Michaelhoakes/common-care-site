"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useSyncExternalStore } from "react";

/**
 * Pick the service whose sentinel overlaps a horizontal “focus band” in the viewport
 * (accounts for sticky header). More stable than IntersectionObserver + ratio sorting.
 */
function pickActiveServiceIndex(sentinels: HTMLElement[]): number {
  if (sentinels.length === 0) return 0;
  const vh = window.innerHeight;
  // Focus band moved upward so chapter feedback feels sooner.
  const bandTop = vh * 0.22;
  const bandBottom = vh * 0.5;
  const bandCenter = (bandTop + bandBottom) / 2;

  let best = 0;
  let bestScore = -1;
  let bestCenterDist = Infinity;

  for (let i = 0; i < sentinels.length; i++) {
    const r = sentinels[i].getBoundingClientRect();
    const lo = Math.max(r.top, bandTop);
    const hi = Math.min(r.bottom, bandBottom);
    const overlap = Math.max(0, hi - lo);
    // Bias the first chapter so we transition to chapter 2 sooner.
    const weightedOverlap = i === 0 ? overlap * 0.72 : overlap;
    const mid = (r.top + r.bottom) / 2;
    const centerDist = Math.abs(mid - bandCenter);

    const wins =
      weightedOverlap > bestScore ||
      (overlap === bestScore &&
        weightedOverlap > 0 &&
        centerDist < bestCenterDist);
    if (wins) {
      bestScore = weightedOverlap;
      best = i;
      bestCenterDist = centerDist;
    }
  }

  if (bestScore <= 0) {
    let bestDist = Infinity;
    for (let i = 0; i < sentinels.length; i++) {
      const r = sentinels[i].getBoundingClientRect();
      const mid = (r.top + r.bottom) / 2;
      // Same early-transition bias when no chapter overlaps the focus band.
      const d = Math.abs(mid - bandCenter) + (i === 0 ? vh * 0.1 : 0);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
  }

  return best;
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

type ServiceItem = {
  title: string;
  desc: string;
  image: string;
  href: string;
  flipX?: boolean;
};

const services: ServiceItem[] = [
  {
    title: "The 360° Evaluation",
    desc: "A thorough baseline to understand how you move and where to begin.",
    image: "/images/_DSF8105.jpeg",
    href: "/care#the-360-evaluation",
  },
  {
    title: "Ongoing Care",
    desc: "60–90 minutes of focused care tailored to your goals. No rushing, no shortcuts.",
    image: "/images/_DSF8511.jpeg",
    href: "/care#the-care-sessions",
    flipX: true,
  },
  {
    title: "Everyday Wellness",
    desc: "Ongoing guidance for people who want consistency over quick fixes.",
    image: "/images/_DSF8789.jpeg",
    href: "/care#everyday-wellness",
  },
];

/** Shared height so image + text column align; tuned for header + breathing room */
const STICKY_VIEWPORT_H =
  "h-[min(640px,calc(100dvh-6rem))] min-h-[480px]";
const STICKY_IMAGE_CLASSES = `${STICKY_VIEWPORT_H} w-full`;

/** Scroll “chapters” under the sticky text — shorter = less blank scroll, taller = smoother IO */
const SENTINEL_MIN_H = "min-h-[min(48dvh,480px)]";
// Make the first chapter advance sooner (360° evaluation felt longer).
const SENTINEL_MIN_H_FIRST = "min-h-[min(28dvh,300px)]";

const TERTIARY_BUTTON_CLASS =
  "group/link inline-flex items-center gap-2 text-[12px] font-mono tracking-[0.24em] uppercase transition-colors duration-300 ease-out";


function ServiceTextPanel({
  s,
  index,
  isActive,
  onActivate,
  setRef,
  dense,
}: {
  s: ServiceItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  setRef?: (el: HTMLDivElement | null, i: number) => void;
  dense?: boolean;
}) {
  const showDetail = dense || isActive;
  const interactive = !dense && !isActive;

  return (
    <div
      ref={setRef ? (el) => setRef(el, index) : undefined}
      className={`flex flex-col justify-start ${
        dense ? "py-8 md:pl-4 lg:pl-6" : "py-3 scroll-mt-28"
      }`}
    >
      <div
        className={`rounded-sm transition-colors ${
          interactive
            ? "group cursor-pointer py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha/40"
            : ""
        }`}
        id={`service-panel-trigger-${index}`}
        {...(interactive
          ? {
              role: "button" as const,
              tabIndex: 0,
              "aria-expanded": false,
              "aria-controls": `service-panel-detail-${index}`,
            }
          : {})}
        onClick={(e) => {
          if (!interactive) return;
          e.preventDefault();
          onActivate();
        }}
        onKeyDown={(e) => {
          if (!interactive) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
          }
        }}
      >
        <h3
          className={`mt-0 transition-colors ${
            showDetail
              ? "opacity-100"
              : "opacity-40 group-hover:opacity-100 group-focus-within:opacity-100"
          }`}
        >
          {s.title}
        </h3>
      </div>

      {showDetail && (
        <div
          id={`service-panel-detail-${index}`}
          role="region"
          aria-labelledby={`service-panel-trigger-${index}`}
          className="services-panel-detail-reveal flex flex-col gap-5"
        >
          <p className="max-w-md">
            {s.desc}
          </p>
          <Link
            href={s.href}
            className={`${TERTIARY_BUTTON_CLASS} w-fit`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Learn more</span>
            <span
              className="inline-block text-[12px] leading-none transition-transform duration-300 ease-out group-hover/link:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ServicesPanels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafScrollRef = useRef(0);

  const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
    sentinelRefs.current[i] = el;
  };

  const activateSection = (i: number) => {
    setActiveIndex(i);
    const el = sentinelRefs.current[i];
    if (!el) return;
    el.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    if (reducedMotion) return;

    const run = () => {
      const nodes = sentinelRefs.current.filter(Boolean) as HTMLElement[];
      if (nodes.length !== services.length) return;
      const next = pickActiveServiceIndex(nodes);
      setActiveIndex((prev) => (next !== prev ? next : prev));
    };

    const schedule = () => {
      cancelAnimationFrame(rafScrollRef.current);
      rafScrollRef.current = requestAnimationFrame(run);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(rafScrollRef.current);
    };
  }, [reducedMotion]);

  return (
    <section id="services" className="py-[80px]">
      <div className="w-full px-6 md:px-16">
        <div className="flex flex-col gap-4">
          <p className="cc-eyebrow">
            the common care method
          </p>
          <h2 className="font-hero-display text-4xl md:text-5xl max-w-4xl">
            Comprehensive care — from evaluation to everyday movement.
          </h2>
        </div>
      </div>

      <div className="hidden md:block pt-10 w-full px-6 md:px-16">
        {reducedMotion ? (
          <div className="flex flex-col gap-20 lg:gap-24">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="grid grid-cols-1 lg:grid-cols-[3fr_1.8fr] gap-10 lg:gap-12 items-center"
              >
                <div
                  className={`relative overflow-hidden rounded-sm ${STICKY_IMAGE_CLASSES}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${s.image})`,
                      transform: s.flipX ? "scaleX(-1)" : undefined,
                    }}
                  />
                </div>
                <div className="min-h-0">
                  <ServiceTextPanel
                    s={s}
                    index={i}
                    isActive
                    onActivate={() => {}}
                    dense
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[3fr_1.8fr] gap-x-8 lg:gap-x-12 items-stretch">
            <div className="relative h-full min-h-0">
              <div
                className={`sticky top-24 md:top-28 overflow-hidden rounded-sm bg-darkgreen/5 ${STICKY_IMAGE_CLASSES}`}
              >
                <span className="sr-only" aria-live="polite" aria-atomic="true">
                  {services[activeIndex]?.title}
                </span>
                {services.map((s, i) => (
                  <div
                    key={s.title}
                    className="absolute inset-0 bg-cover bg-center transition-[opacity] duration-[580ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      backgroundImage: `url(${s.image})`,
                      transform: s.flipX ? "scaleX(-1)" : undefined,
                      opacity: activeIndex === i ? 1 : 0,
                      zIndex: activeIndex === i ? 2 : 1,
                    }}
                    aria-hidden={activeIndex !== i}
                  />
                ))}

                <div className="absolute inset-0 pointer-events-none z-[3] opacity-[0.04] mix-blend-overlay rounded-sm">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "repeat",
                    }}
                  />
                </div>

                {/* progress dots removed */}
              </div>
            </div>

            <div className="min-w-0 flex min-h-0 flex-col h-full">
              <div
                className={`sticky top-24 md:top-28 z-10 flex w-full items-center ${STICKY_VIEWPORT_H}`}
              >
                <div className="w-full py-2 pl-5 lg:pl-9 pr-4">
                  <div className="max-w-md">
                    {services.map((s, i) => (
                      <div key={s.title}>
                        {i > 0 ? (
                          <div
                            className="border-t border-darkgreen/20 pt-7 pb-1 -mr-4 lg:-mr-6 w-[calc(100%+1rem)] lg:w-[calc(100%+1.5rem)]"
                            aria-hidden
                          />
                        ) : null}
                        <ServiceTextPanel
                          s={s}
                          index={i}
                          isActive={activeIndex === i}
                          onActivate={() => activateSection(i)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {services.map((s, i) => (
                <div
                  key={`sentinel-${s.title}`}
                  ref={(el) => setSentinelRef(el, i)}
                  data-service-index={i}
                  className={`${i === 0 ? SENTINEL_MIN_H_FIRST : SENTINEL_MIN_H} w-full shrink-0`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full md:hidden pt-10 px-6 gap-16">
        {services.map((s, i) => (
          <article key={s.title}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-darkgreen/5">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${s.image})`,
                  transform: s.flipX ? "scaleX(-1)" : undefined,
                }}
              />
            </div>
            <div className="pt-6 flex flex-col gap-3">
              <span className="text-xs font-mono font-medium tracking-[0.22em] uppercase text-matcha/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-hero-display text-2xl font-medium leading-tight">
                {s.title}
              </h3>
              <p>
                {s.desc}
              </p>
              <Link
                href={s.href}
                className={TERTIARY_BUTTON_CLASS}
              >
                <span>Learn more</span>
                <span className="inline-block text-[12px] leading-none transition-transform duration-300 ease-out group-hover/link:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
