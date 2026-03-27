"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef, useState, useEffect, useSyncExternalStore } from "react";

/**
 * Pick the service whose sentinel overlaps a horizontal “focus band” in the viewport
 * (accounts for sticky header). More stable than IntersectionObserver + ratio sorting.
 */
function pickActiveServiceIndex(
  sentinels: HTMLElement[],
  opts?: { bandTopRatio?: number; bandBottomRatio?: number }
): number {
  if (sentinels.length === 0) return 0;
  const vh = window.innerHeight;
  const bandTopRatio = opts?.bandTopRatio ?? 0.22;
  const bandBottomRatio = opts?.bandBottomRatio ?? 0.5;
  // Focus band moved upward so chapter feedback feels sooner.
  const bandTop = vh * bandTopRatio;
  const bandBottom = vh * bandBottomRatio;
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
    title: "Care Evaluation",
    desc: "An in-depth look at your overall health, combining your story with objective data to truly understand what’s going on.",
    image: "/images/_DSF8105.jpeg",
    href: "/care#the-360-evaluation",
  },
  {
    title: "Care Sessions",
    desc: "One-on-one sessions built around you, combining hands-on care, movement, and advanced technology to support how your body heals.",
    image: "/images/_DSF8511.jpeg",
    href: "/care#the-care-sessions",
    flipX: true,
  },
  {
    title: "Recovery Care",
    desc: "Targeted recovery sessions designed to support how your body adapts to training, stress, and daily demands so you can sustain and improve your overall health.",
    image: "/images/_DSF8789.jpeg",
    href: "/care#everyday-wellness",
  },
];

/** Shared height so image + text column align; tuned for header + breathing room */
const STICKY_VIEWPORT_H =
  "h-[min(580px,calc(100dvh-6rem))] min-h-[440px]";
const STICKY_IMAGE_CLASSES = `${STICKY_VIEWPORT_H} w-full`;

/** Scroll “chapters” under the sticky text — shorter = less blank scroll, taller = smoother IO */
const SENTINEL_MIN_H = "min-h-[min(48dvh,480px)]";
// Make the first chapter advance sooner (Care Evaluation felt longer).
const SENTINEL_MIN_H_FIRST = "min-h-[min(28dvh,300px)]";
// Hold the sticky scene longer after chapter 3 engages before next section appears.
const SENTINEL_MIN_H_LAST = "min-h-[min(72dvh,760px)]";

/** Shared “Learn more” control — matches editorial cc-text-btn (16px + underline) */
const SERVICES_LEARN_MORE_CLASS =
  "cc-text-btn !inline-flex items-center gap-1.5 group/link transition-opacity duration-300 ease-out hover:opacity-80";

/** Vertical slide (% of frame): modest distance + smooth ease reads calmer than a hard cut */
const SERVICE_IMAGE_SLIDE_PCT = 11;
/** ms — slightly long so the move can ease out without feeling snappy */
const SERVICE_IMAGE_TRANSITION_MS = 680;
/** Soft deceleration into rest (no harsh “hit” at the end) */
const SERVICE_IMAGE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function serviceImageLayerStyle(
  index: number,
  activeIndex: number,
  flipX?: boolean
): Pick<CSSProperties, "transform" | "opacity" | "zIndex"> {
  const isActive = activeIndex === index;
  const ty = isActive ? 0 : index < activeIndex ? -SERVICE_IMAGE_SLIDE_PCT : SERVICE_IMAGE_SLIDE_PCT;
  const parts = [`translateY(${ty}%)`];
  if (flipX) parts.push("scaleX(-1)");
  return {
    transform: parts.join(" "),
    opacity: isActive ? 1 : 0,
    zIndex: isActive ? 2 : 1,
  };
}


function ServiceTextPanel({
  s,
  index,
  isActive,
  onActivate,
  setRef,
  dense,
  isLast,
}: {
  s: ServiceItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  setRef?: (el: HTMLDivElement | null, i: number) => void;
  dense?: boolean;
  isLast?: boolean;
}) {
  const showDetail = dense || isActive;
  const interactive = !dense && !isActive;

  return (
    <div
      ref={setRef ? (el) => setRef(el, index) : undefined}
      className={`flex flex-col justify-start ${
        dense
          ? "py-8 md:pl-4 lg:pl-6"
          : `scroll-mt-28 pt-0 pb-0 ${isLast ? "" : "mb-[22px]"}`
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
          className={`cc-h3-services cc-heading-ms mt-0 transition-colors ${
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
          className="services-panel-detail-reveal flex flex-col gap-4"
        >
          <p className="max-w-md cc-body-18 text-[18px] leading-[26px]">
            {s.desc}
          </p>
          <Link
            href={s.href}
            className={`${SERVICES_LEARN_MORE_CLASS} w-fit`}
            onClick={(e) => e.stopPropagation()}
          >
            Learn more
            <span
              className="inline-block leading-none transition-transform duration-300 ease-out group-hover/link:translate-x-0.5"
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
  const [releaseMobileSticky, setReleaseMobileSticky] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileSentinelRefs = useRef<(HTMLElement | null)[]>([]);
  const mobileStickyFrameRef = useRef<HTMLDivElement | null>(null);
  const recoveryDividerRef = useRef<HTMLDivElement | null>(null);
  const releaseMobileStickyRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const rafScrollRef = useRef(0);
  const rafScrollMobileRef = useRef(0);

  const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
    sentinelRefs.current[i] = el;
  };

  const setMobileSentinelRef = (el: HTMLElement | null, i: number) => {
    mobileSentinelRefs.current[i] = el;
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

  const activateMobileSection = (i: number) => {
    setActiveIndex(i);
    const el = mobileSentinelRefs.current[i];
    if (!el) return;
    el.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    if (reducedMotion) return;

    const run = () => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches
      ) {
        return;
      }
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

  useEffect(() => {
    if (reducedMotion) return;

    const run = () => {
      if (
        typeof window === "undefined" ||
        !window.matchMedia("(max-width: 767px)").matches
      ) {
        return;
      }
      const nodes = mobileSentinelRefs.current.filter(Boolean) as HTMLElement[];
      if (nodes.length !== services.length) return;
      const next = pickActiveServiceIndex(nodes, {
        bandTopRatio: 0.32,
        bandBottomRatio: 0.62,
      });
      setActiveIndex((prev) => (next !== prev ? next : prev));
    };

    const schedule = () => {
      cancelAnimationFrame(rafScrollMobileRef.current);
      rafScrollMobileRef.current = requestAnimationFrame(run);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(rafScrollMobileRef.current);
    };
  }, [reducedMotion]);

  const servicesIntro = (
    <h2 className="cc-heading-sm w-full max-w-4xl md:max-w-none xl:max-w-4xl text-balance">
      A complete approach to understanding your body, your story, and your overall health.
    </h2>
  );
  // Release sticky exactly when image frame bottom reaches the divider before Recovery.
  const isMobileImageSticky = !releaseMobileSticky;

  useEffect(() => {
    releaseMobileStickyRef.current = releaseMobileSticky;
  }, [releaseMobileSticky]);

  useEffect(() => {
    const run = () => {
      if (
        typeof window === "undefined" ||
        !window.matchMedia("(max-width: 767px)").matches
      ) {
        setReleaseMobileSticky(false);
        return;
      }
      const stickyFrame = mobileStickyFrameRef.current;
      const divider = recoveryDividerRef.current;
      if (!stickyFrame || !divider) return;

      const frameBottom = stickyFrame.getBoundingClientRect().bottom;
      const dividerTop = divider.getBoundingClientRect().top;
      const delta = frameBottom - dividerTop;
      const currentY = window.scrollY;
      const scrollingDown = currentY >= lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      // Hysteresis prevents rapid sticky/unsticky oscillation at the crossover.
      if (!releaseMobileStickyRef.current && scrollingDown && delta >= 2) {
        setReleaseMobileSticky(true);
        return;
      }
      if (releaseMobileStickyRef.current && !scrollingDown && delta <= -28) {
        setReleaseMobileSticky(false);
      }
    };

    const schedule = () => requestAnimationFrame(run);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      id="services"
      className="pt-[30px] pb-10 md:pt-[46px] md:pb-14 lg:pt-[70px] lg:pb-20"
    >
      <div className="hidden md:block w-full px-6 md:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
        {reducedMotion ? (
          <div className="flex flex-col">
            <div className="mb-10">{servicesIntro}</div>
            <div
              className="w-full border-t border-darkgreen/12"
              aria-hidden
            />
            <div className="flex flex-col gap-20 lg:gap-24 pt-[22px]">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="grid grid-cols-1 lg:grid-cols-[2.75fr_1.85fr] gap-10 lg:gap-12 items-center"
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
                    isLast={i === services.length - 1}
                  />
                </div>
              </div>
            ))}
            </div>
            <div
              className="mt-[22px] w-full border-t border-darkgreen/12"
              aria-hidden
            />
          </div>
        ) : (
          <div className="grid grid-cols-[2.75fr_1.85fr] gap-x-8 lg:gap-x-12 gap-y-10 items-stretch">
            <div className="col-span-2 w-full min-w-0">{servicesIntro}</div>
            <div className="relative h-full min-h-0">
              <div className="sticky top-24 md:top-28 z-10 flex w-full flex-col">
                <div
                  className={`relative overflow-hidden rounded-sm bg-darkgreen/5 ${STICKY_IMAGE_CLASSES}`}
                >
                  <span className="sr-only" aria-live="polite" aria-atomic="true">
                    {services[activeIndex]?.title}
                  </span>
                  {services.map((s, i) => (
                    <div
                      key={s.title}
                      className="absolute inset-0 bg-cover bg-center motion-safe:transition-[transform,opacity] motion-reduce:transition-none"
                      style={{
                        backgroundImage: `url(${s.image})`,
                        transitionProperty: "transform, opacity",
                        transitionDuration: `${SERVICE_IMAGE_TRANSITION_MS}ms`,
                        transitionTimingFunction: SERVICE_IMAGE_EASE,
                        ...serviceImageLayerStyle(i, activeIndex, s.flipX),
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
                </div>
              </div>
            </div>

            <div className="min-w-0 flex min-h-0 flex-col h-full">
              <div className="sticky top-24 md:top-28 z-10 flex w-full flex-col">
                <div
                  className={`flex w-full min-h-0 items-center ${STICKY_VIEWPORT_H}`}
                >
                  <div className="w-full py-2 pl-5 lg:pl-9 pr-4">
                    <div className="max-w-md">
                      <div
                        className="border-t border-darkgreen/12 pt-[22px] -mr-4 lg:-mr-6 w-[calc(100%+1rem)] lg:w-[calc(100%+1.5rem)]"
                        aria-hidden
                      />
                      {services.map((s, i) => (
                        <div key={s.title}>
                          {i > 0 ? (
                            <div
                              className="border-t border-darkgreen/12 pt-[22px] -mr-4 lg:-mr-6 w-[calc(100%+1rem)] lg:w-[calc(100%+1.5rem)]"
                              aria-hidden
                            />
                          ) : null}
                          <ServiceTextPanel
                            s={s}
                            index={i}
                            isActive={activeIndex === i}
                            onActivate={() => activateSection(i)}
                            isLast={i === services.length - 1}
                          />
                        </div>
                      ))}
                      <div
                        className="border-t border-darkgreen/12 mt-[22px] -mr-4 lg:-mr-6 w-[calc(100%+1rem)] lg:w-[calc(100%+1.5rem)]"
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              </div>
              {services.map((s, i) => (
                <div
                  key={`sentinel-${s.title}`}
                  ref={(el) => setSentinelRef(el, i)}
                  data-service-index={i}
                  className={`${
                    i === 0
                      ? SENTINEL_MIN_H_FIRST
                      : i === services.length - 1
                        ? SENTINEL_MIN_H_LAST
                        : SENTINEL_MIN_H
                  } w-full shrink-0`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="flex flex-col w-full md:hidden px-6 md:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          {reducedMotion ? (
            <>
              <div className="mb-10">{servicesIntro}</div>
              <div className="flex flex-col gap-8 pt-[22px]">
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
                      <h3 className="cc-h3-services cc-heading-ms">{s.title}</h3>
                      <p className="cc-body-18 text-[18px] leading-[26px]">
                        {s.desc}
                      </p>
                    </div>
                    <Link
                      href={s.href}
                      className={`${SERVICES_LEARN_MORE_CLASS} mt-4`}
                    >
                      Learn more
                      <span
                        className="inline-block leading-none transition-transform duration-300 ease-out group-hover/link:translate-x-0.5"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
              <div className="-mx-6 mt-[22px] border-t border-darkgreen/12" aria-hidden />
            </>
          ) : (
            <>
              <div className="mb-10">{servicesIntro}</div>
              <div className="mt-[22px]">
                <div className="relative">
                  <div
                    className={`z-20 -mx-1 px-1 pb-3 bg-light-yellow/92 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-light-yellow/85 ${
                      isMobileImageSticky ? "sticky top-[4.75rem]" : "relative"
                    }`}
                  >
                    <div
                      ref={mobileStickyFrameRef}
                      className="relative w-full overflow-hidden rounded-sm bg-darkgreen/5 h-[min(232px,47vw)] max-h-[268px]"
                    >
                      <span
                        className="sr-only"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {services[activeIndex]?.title}
                      </span>
                      {services.map((s, i) => (
                        <div
                          key={`mobile-svc-img-${s.title}`}
                          className="absolute inset-0 bg-cover bg-center motion-safe:transition-[transform,opacity] motion-reduce:transition-none"
                          style={{
                            backgroundImage: `url(${s.image})`,
                            transitionProperty: "transform, opacity",
                            transitionDuration: `${SERVICE_IMAGE_TRANSITION_MS}ms`,
                            transitionTimingFunction: SERVICE_IMAGE_EASE,
                            ...serviceImageLayerStyle(i, activeIndex, s.flipX),
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
                    </div>
                  </div>

                  <div className="relative flex flex-col pt-2">
                    <div
                      className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-14 bg-gradient-to-b from-light-yellow via-light-yellow/96 to-transparent"
                      aria-hidden
                    />
                    {services.map((s, i) => {
                      const active = activeIndex === i;
                      return (
                        <article key={s.title} ref={(el) => setMobileSentinelRef(el, i)}>
                          {i > 0 ? (
                            <div
                              ref={i === services.length - 1 ? recoveryDividerRef : undefined}
                              className="-mx-1 border-t border-darkgreen/12"
                              aria-hidden
                            />
                          ) : null}
                          <button
                            type="button"
                            className={`w-full cursor-pointer text-left py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matcha/40 motion-safe:transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                              active ? "opacity-100" : "opacity-[0.56]"
                            }`}
                            aria-current={active ? "true" : undefined}
                            onClick={() => activateMobileSection(i)}
                          >
                            <h3
                              className={`cc-h3-services cc-heading-ms transition-colors ${
                                active ? "text-darkgreen" : "text-darkgreen/65"
                              }`}
                            >
                              {s.title}
                            </h3>
                            <p
                              className={`mt-3 cc-body-18 text-[17px] leading-[25px] transition-colors ${
                                active ? "text-forest/88" : "text-forest/52"
                              }`}
                            >
                              {s.desc}
                            </p>
                          </button>
                          <Link href={s.href} className={`${SERVICES_LEARN_MORE_CLASS} -mt-1 mb-6`}>
                            Learn more
                            <span
                              className="inline-block leading-none transition-transform duration-300 ease-out group-hover/link:translate-x-0.5"
                              aria-hidden
                            >
                              →
                            </span>
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="-mx-6 mt-[30px] border-t border-darkgreen/12 sm:hidden" aria-hidden />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
