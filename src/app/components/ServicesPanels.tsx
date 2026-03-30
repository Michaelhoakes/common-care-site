"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import PulseDot from "./PulseDot";
import {
  useState,
  useSyncExternalStore,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

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
  ctaLabel: string;
  flipX?: boolean;
};

const services: ServiceItem[] = [
  {
    title: "Care Evaluation",
    desc: "An in-depth look at your overall health, combining your story with objective data to truly understand what’s going on.",
    image: "/images/_DSF8105.jpeg",
    href: "/care#the-360-evaluation",
    ctaLabel: "How we evaluate",
  },
  {
    title: "Care Sessions",
    desc: "One-on-one sessions built around you, combining hands-on care, movement, and advanced technology to support how your body heals.",
    image: "/images/_DSF8511.jpeg",
    href: "/care#the-care-sessions",
    ctaLabel: "How we treat",
    flipX: true,
  },
  {
    title: "Wellness Care",
    desc: "Sessions designed to support your nervous system, reduce stress, and help your body feel more balanced and regulated.",
    image: "/images/_DSF8789.jpeg",
    href: "/care#everyday-wellness",
    ctaLabel: "How we help you reset",
  },
];

/** Desktop shared image frame + reduced-motion rows */
const STICKY_VIEWPORT_H = "h-[560px] min-h-[440px]";
const STICKY_IMAGE_CLASSES = `${STICKY_VIEWPORT_H} w-full`;

/** Shared service CTA — matches editorial cc-text-btn (16px + underline) */
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
  idPrefix = "",
}: {
  s: ServiceItem;
  index: number;
  isActive: boolean;
  onActivate: () => void;
  setRef?: (el: HTMLDivElement | null, i: number) => void;
  dense?: boolean;
  isLast?: boolean;
  /** Avoid duplicate ids when desktop + mobile panels both mount (CSS-hidden). */
  idPrefix?: string;
}) {
  const showDetail = dense || isActive;
  const interactive = !dense && !isActive;
  const triggerId = `${idPrefix}service-panel-trigger-${index}`;
  const detailId = `${idPrefix}service-panel-detail-${index}`;

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
        id={triggerId}
        {...(interactive
          ? {
              role: "button" as const,
              tabIndex: 0,
              "aria-expanded": false,
              "aria-controls": detailId,
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
        <div className="flex items-center gap-2.5">
          {!dense && isActive ? (
            <PulseDot color="matcha" size="sm" />
          ) : null}
          <h3 className="cc-h3-services cc-heading-ms mt-0 flex-1 min-w-0 transition-colors opacity-100">
            {s.title}
          </h3>
        </div>
      </div>

      {showDetail && (
        <div
          id={detailId}
          role="region"
          aria-labelledby={triggerId}
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
            {s.ctaLabel}
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

export default function ServicesPanels({
  sectionClassName = "",
}: {
  sectionClassName?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  /** Set when user picks a row on mobile; cleared after scroll runs (Figma-style anchor). */
  const pendingMobileScrollIndexRef = useRef<number | null>(null);
  const mobileRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setMobileRowRef = useCallback((el: HTMLDivElement | null, index: number) => {
    mobileRowRefs.current[index] = el;
  }, []);

  const activateSection = (i: number) => {
    setActiveIndex(i);
  };

  /** Mobile only: expand row + scroll it into view under the sticky header after paint. */
  const activateMobileSection = (i: number) => {
    pendingMobileScrollIndexRef.current = i;
    setActiveIndex(i);
  };

  useLayoutEffect(() => {
    const i = pendingMobileScrollIndexRef.current;
    if (i === null) return;
    pendingMobileScrollIndexRef.current = null;

    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const el = mobileRowRefs.current[i];
    if (!el) return;

    const instant =
      reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.scrollIntoView({
      behavior: instant ? "instant" : "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [activeIndex, reducedMotion]);

  const servicesIntro = (
    <h2 className="cc-heading-sm w-full max-w-4xl md:max-w-none xl:max-w-4xl text-balance">
      A complete approach to understanding, treating, and sustaining your health.
    </h2>
  );

  return (
    <section
      id="services"
      className={`pt-10 pb-10 max-md:after:hidden md:pt-[46px] md:pb-20 lg:pt-[70px] ${sectionClassName}`.trim()}
    >
      <div className="hidden md:block w-full px-6 md:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
        {reducedMotion ? (
          <div className="flex flex-col">
            <div className="mb-10">{servicesIntro}</div>
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
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mb-10">{servicesIntro}</div>
            <div className="mt-10 grid grid-cols-[2.75fr_1.85fr] gap-x-8 lg:gap-x-12 items-center">
              <div className="relative min-w-0">
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
                        pointerEvents: "none",
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

              <div className="min-w-0">
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
          </div>
        )}
        </div>
      </div>

      <div className="flex flex-col w-full md:hidden px-6 md:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-10">{servicesIntro}</div>
          <div className="flex flex-col mt-[22px]">
            <div
              className="border-t border-darkgreen/12 pt-[22px] -mx-1 w-[calc(100%+0.5rem)]"
              aria-hidden
            />
            {services.map((s, i) => {
              const expanded = reducedMotion || activeIndex === i;
              const MOBILE_RULE =
                "border-t border-darkgreen/12 -mx-1 w-[calc(100%+0.5rem)]";
              /** Collapsed stack: line above row i. Skip when previous row already ends with a trailing divider (selected). */
              const showLeadingDivider =
                i > 0 &&
                (reducedMotion || activeIndex !== i - 1);
              /** Selected row: line after its block (incl. image) before the next title. */
              const showTrailingDivider =
                !reducedMotion &&
                activeIndex === i &&
                i < services.length - 1;

              return (
                <div
                  key={s.title}
                  ref={(el) => setMobileRowRef(el, i)}
                  className="flex flex-col scroll-mt-28"
                >
                  {showLeadingDivider ? (
                    <div
                      className={`${MOBILE_RULE} pt-[22px]`}
                      aria-hidden
                    />
                  ) : null}
                  <ServiceTextPanel
                    s={s}
                    index={i}
                    isActive={activeIndex === i}
                    onActivate={() => activateMobileSection(i)}
                    dense={reducedMotion}
                    isLast={i === services.length - 1}
                    idPrefix="mobile-"
                  />
                  {expanded ? (
                    <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-sm bg-darkgreen/5">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${s.image})`,
                          transform: s.flipX ? "scaleX(-1)" : undefined,
                        }}
                      />
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
                  ) : null}
                  {showTrailingDivider ? (
                    <div
                      className={`${MOBILE_RULE} mt-[22px] pt-[22px]`}
                      aria-hidden
                    />
                  ) : null}
                </div>
              );
            })}
            <div
              className="border-t border-darkgreen/12 mt-[22px] -mx-1 w-[calc(100%+0.5rem)]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
