"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCareParallaxScrollY } from "../../hooks/useCareParallaxScrollY";
import CareEvaluationCarousel from "./CareEvaluationCarousel";
import {
  useCareSidebarProgress,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../hooks/useCareSidebarProgress";

/** Sidebar + scrollspy: overview first, then each care chapter (Seed-style persistent nav). */
const CARE_NAV_SECTIONS = [
  { id: "care-approach", label: "Overview" },
  { id: "the-360-evaluation", label: "Care Evaluation" },
  { id: "the-care-sessions", label: "Care Sessions" },
  { id: "everyday-wellness", label: "Recovery Care" },
] as const;

const CARE_SECTION_IDS: readonly string[] = CARE_NAV_SECTIONS.map((s) => s.id);

const REVEAL_SECTION_IDS = CARE_NAV_SECTIONS.map((s) => s.id);

type IncludedItem = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

type ServiceItem = {
  title: string;
  description: string;
};

const INCLUDED_ITEMS: IncludedItem[] = [
  {
    title: "Movement + gait analysis",
    description:
      "We observe how your body moves and how weight travels through your stride, then translate it into actionable insights.",
  },
  {
    title: "Postural + mobility assessment",
    description:
      "We evaluate alignment and available range so you understand constraints and opportunities before next steps.",
  },
  {
    title: "Strength + asymmetry testing",
    description:
      "We check strength and side-to-side differences to understand load capacity and where targeted support is needed.",
  },
  {
    title: "Body composition analysis (InBody)",
    description:
      "We track body composition to complement the clinical picture and support progress monitoring over time.",
  },
  {
    title: "Recovery + stress-load context",
    description:
      "We consider recovery patterns and daily stress so your plan is built for long-term sustainability.",
  },
  {
    title: "Goals + health history",
    description:
      "We align on outcomes that matter to you and map how your history informs pacing, priorities, and risk.",
  },
];

const WELLNESS_SLIDES = [
  {
    src: "/images/_DSF8789.jpeg",
    alt: "Calming wellness room environment at Common Care",
  },
  {
    src: "/images/Soundbed.jpg",
    alt: "Sound bed setup used for recovery and restorative wellness work",
  },
] as const;

const CARE_SESSION_SERVICES: ServiceItem[] = [
  {
    title: "Manual therapy",
    description:
      "Hands-on treatment to improve mobility, reduce discomfort, and support how your body moves day to day.",
  },
  {
    title: "Injury treatment",
    description:
      "Targeted care for acute or persistent injuries, paired with clear progression so recovery is steady and measurable.",
  },
];

const EVERYDAY_WELLNESS_SERVICES: ServiceItem[] = [
  {
    title: "Red light therapy",
    description:
      "Light-based recovery support used to complement tissue healing and reduce post-session soreness.",
  },
  {
    title: "Sound bed",
    description:
      "A restorative session designed to downshift your nervous system and support recovery through guided sound.",
  },
  {
    title: "PEMF",
    description:
      "Pulsed electromagnetic field sessions to support circulation and recovery as part of your broader wellness plan.",
  },
  {
    title: "Compression",
    description:
      "Compression-based recovery work to help with circulation, swelling management, and post-load reset.",
  },
];

export default function CarePageClient() {
  const isDesktopNav = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const getSectionEl = useCallback(
    (id: string) => sectionRefs.current[id] ?? null,
    []
  );
  const sidebarProgress = useCareSidebarProgress(CARE_SECTION_IDS, getSectionEl, {
    enabled: isDesktopNav,
    readingLineRatio: 0.36,
    reduceMotion: prefersReducedMotion,
  });

  const [mobileActiveId, setMobileActiveId] = useState<string>(
    CARE_NAV_SECTIONS[0].id
  );
  const activeId = isDesktopNav ? sidebarProgress.activeId : mobileActiveId;
  const revealedRef = useRef<Set<string>>(new Set());
  // Multiple "What's included" rows can be open at once.
  const [openIncluded, setOpenIncluded] = useState<Set<number>>(() => new Set());
  const [openSessionServices, setOpenSessionServices] = useState<Set<number>>(
    () => new Set()
  );
  const [openWellnessServices, setOpenWellnessServices] = useState<Set<number>>(
    () => new Set()
  );
  const mobileScrollSpyRef = useRef<IntersectionObserver | null>(null);
  useCareParallaxScrollY();

  // Mobile / narrow: lightweight scrollspy (desktop uses geometry-based progress)
  useEffect(() => {
    if (isDesktopNav) {
      mobileScrollSpyRef.current?.disconnect();
      mobileScrollSpyRef.current = null;
      return;
    }

    const raf = requestAnimationFrame(() => {
      mobileScrollSpyRef.current?.disconnect();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const sid = entry.target.id;
            if (sid && CARE_NAV_SECTIONS.some((s) => s.id === sid)) {
              setMobileActiveId(sid);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      CARE_NAV_SECTIONS.forEach(({ id }) => {
        const el = sectionRefs.current[id];
        if (el) observer.observe(el);
      });
      mobileScrollSpyRef.current = observer;
    });

    return () => {
      cancelAnimationFrame(raf);
      mobileScrollSpyRef.current?.disconnect();
      mobileScrollSpyRef.current = null;
    };
  }, [isDesktopNav]);

  // Section enter animation (once): fade + translate when in view; CSS respects prefers-reduced-motion
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (id && !revealedRef.current.has(id)) {
            revealedRef.current.add(id);
            entry.target.classList.add("care-section-revealed");
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0 }
    );

    REVEAL_SECTION_IDS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleIncluded = (idx: number) => {
    setOpenIncluded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleSessionService = (idx: number) => {
    setOpenSessionServices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleWellnessService = (idx: number) => {
    setOpenWellnessServices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="w-full px-6 md:px-16">
      <div className="mx-auto max-w-[1400px] mt-14 md:mt-18 lg:mt-20 flex flex-col lg:flex-row lg:gap-20 xl:gap-24 lg:items-stretch">
        {/* Sidebar: sequential vertical progress (desktop); sticky within content column */}
        <nav
          className="care-sidebar w-full lg:w-[260px] xl:w-[280px] shrink-0"
          aria-label="On this page"
        >
          <div className="relative lg:h-full">
            <div className="sticky top-24 lg:top-28">
              {/* Mobile: flex chips. Desktop: 2-col grid + li:contents so row-gap is identical between every row. */}
              <ul className="flex w-full max-w-full flex-wrap gap-x-6 gap-y-0.5 lg:grid lg:max-w-none lg:grid-cols-[0.75rem_minmax(0,1fr)] lg:gap-x-3 lg:gap-y-2">
                {CARE_NAV_SECTIONS.map(({ id, label }, index) => {
                  const fill = isDesktopNav
                    ? (sidebarProgress.fills[index] ?? 0)
                    : 0;
                  const done = isDesktopNav && fill >= 0.998;
                  const reading =
                    isDesktopNav &&
                    index === sidebarProgress.activeIndex &&
                    !done;
                  const upcoming =
                    isDesktopNav && !done && index > sidebarProgress.activeIndex;

                  const isActive = activeId === id;
                  const labelTone = isDesktopNav
                    ? done
                      ? "text-forest/80"
                      : reading
                        ? "text-forest font-medium"
                        : upcoming
                          ? "text-forest/45 hover:text-forest/65"
                          : "text-forest/70"
                    : isActive
                      ? "text-forest font-medium"
                      : "text-forest/65 hover:text-forest/85";

                  return (
                    <li key={id} className="contents">
                      <div
                        className="hidden h-full min-h-0 w-full flex-col items-center lg:flex"
                        aria-hidden
                      >
                        <div className="relative mx-auto min-h-0 w-[2px] flex-1 overflow-hidden rounded-full bg-forest/15">
                          <span
                            className="care-nav-progress-fill pointer-events-none absolute inset-x-0 top-0 h-full w-full origin-top rounded-full bg-marigold/85"
                            style={{
                              transform: `scaleY(${fill})`,
                            }}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollTo(id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`
                          care-nav-link group flex min-h-0 min-w-0 items-start self-stretch py-1.5 text-left text-base font-normal leading-tight
                          transition-colors duration-200 ease-out
                          ${labelTone}
                        `}
                      >
                        <span className="block w-full">{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main column: overview + all chapters (single column beside sidebar) */}
        <div className="min-w-0 flex-1 pb-24 md:pb-32 pt-8 md:pt-10 lg:pt-0">
          <section
            id="care-approach"
            ref={(el) => { sectionRefs.current["care-approach"] = el; }}
            className="care-section care-section-animate scroll-mt-28"
          >
            <p className="cc-eyebrow text-darkgreen">
              Our care approach
            </p>
            <h2 className="cc-heading-md max-w-4xl">
              Care begins with understanding you as a whole. We consider how you move, your stress and load, and daily life. That context guides unhurried, one-on-one care built for long-term health.
            </h2>
            <ul className="care-list text-forest/90">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Whole-person lens — movement, stress load, daily patterns</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Unhurried one-on-one care (60–90 minutes)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Long-term orientation over quick fixes</span>
              </li>
            </ul>
          </section>

          <div className="mt-20 pt-20 border-t border-forest/10" aria-hidden />

          {/* Care Evaluation */}
          <section
            id="the-360-evaluation"
            ref={(el) => { sectionRefs.current["the-360-evaluation"] = el; }}
            className="care-section care-section-animate scroll-mt-28"
          >
            <h2 className="cc-heading-md text-darkgreen">Care Evaluation</h2>
            <div className="min-w-0">
              <p className="care-body text-forest/90">
                An in-depth look at your overall health, combining your story with objective data to truly understand what’s going on.
              </p>
              <CareEvaluationCarousel />
              <p className="care-label text-forest/60 mt-10 md:mt-12">
                What’s included
              </p>
              <div className="care-included-grid text-forest/90 !grid-cols-1">
                {INCLUDED_ITEMS.map((item, idx) => {
                  const isOpen = openIncluded.has(idx);
                  const buttonId = `included-toggle-${idx}`;
                  const panelId = `included-panel-${idx}`;

                  return (
                    <div key={item.title} className="relative">
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleIncluded(idx)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full flex items-start justify-between gap-3 text-left text-[16px] leading-relaxed text-darkgreen transition-colors group"
                      >
                        <span className="font-medium transition-colors group-hover:text-forest/70">
                          {item.title}
                        </span>
                        <span
                          aria-hidden
                          className="relative shrink-0 inline-flex items-center justify-center h-6 w-6 overflow-visible origin-center transition-colors duration-200 ease-out"
                        >
                          <span
                            className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-forest/70 transition-colors group-hover:bg-forest/50"
                          />
                          <span
                            className={`absolute left-1/2 top-1/2 w-px h-3.5 -translate-x-1/2 -translate-y-1/2 bg-forest/70 transition-colors transition-opacity transition-transform duration-200 group-hover:bg-forest/50 ${
                              isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                            }`}
                          />
                        </span>
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        aria-hidden={!isOpen}
                        className={`mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-2">
                            <p className="text-[15px] leading-relaxed text-forest/90">
                              {item.description}
                            </p>
                            {item.imageSrc && (
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt ?? ""}
                                loading="lazy"
                                className="w-full max-w-[26rem] rounded-lg"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {idx < INCLUDED_ITEMS.length - 1 && (
                        <div
                          aria-hidden
                          className="h-px bg-forest/10 mt-2 mb-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <a
                href="/technology"
                className="mt-8 cc-text-btn"
              >
                Explore how we measure →
              </a>
            </div>
          </section>

          <div className="mt-20 pt-20 border-t border-forest/10" aria-hidden />

          {/* Section 3 — Care Sessions */}
          <section
            id="the-care-sessions"
            ref={(el) => { sectionRefs.current["the-care-sessions"] = el; }}
            className="care-section care-section-animate scroll-mt-28"
          >
            <div className="flex flex-col">
              <h2 className="cc-heading-md text-darkgreen">Care Sessions</h2>
              <p className="care-body text-forest/90">
                One-on-one sessions built around you, combining hands-on care, movement, and advanced technology to support how your body heals.
              </p>
              <div className="mt-10 w-full max-w-none overflow-hidden rounded-xl bg-forest/[0.03]">
                <div className="relative aspect-[21/9] min-h-[220px] w-full sm:aspect-[2/1] md:min-h-[280px]">
                  <img
                    src="/images/Treatment-hands.JPG"
                    alt="Hands-on treatment session at Common Care"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                    sizes="(min-width: 1400px) 1400px, 100vw"
                  />
                </div>
              </div>
              <p className="care-label text-forest/60 mt-10 md:mt-12">
                Services
              </p>
              <div className="care-included-grid text-forest/90 !grid-cols-1">
                {CARE_SESSION_SERVICES.map((item, idx) => {
                  const isOpen = openSessionServices.has(idx);
                  const buttonId = `session-service-toggle-${idx}`;
                  const panelId = `session-service-panel-${idx}`;
                  return (
                    <div key={item.title} className="relative">
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleSessionService(idx)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="w-full flex items-start justify-between gap-3 text-left text-[16px] leading-relaxed text-darkgreen transition-colors group"
                      >
                        <span className="font-medium transition-colors group-hover:text-forest/70">
                          {item.title}
                        </span>
                        <span
                          aria-hidden
                          className="relative shrink-0 inline-flex items-center justify-center h-6 w-6 overflow-visible origin-center transition-colors duration-200 ease-out"
                        >
                          <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-forest/70 transition-colors group-hover:bg-forest/50" />
                          <span
                            className={`absolute left-1/2 top-1/2 w-px h-3.5 -translate-x-1/2 -translate-y-1/2 bg-forest/70 transition-colors transition-opacity transition-transform duration-200 group-hover:bg-forest/50 ${
                              isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                            }`}
                          />
                        </span>
                      </button>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        aria-hidden={!isOpen}
                        className={`mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-[15px] leading-relaxed text-forest/90">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {idx < CARE_SESSION_SERVICES.length - 1 && (
                        <div aria-hidden className="h-px bg-forest/10 mt-2 mb-2" />
                      )}
                    </div>
                  );
                })}
              </div>
              {/* (removed) Extra closing paragraph for care sessions */}
            </div>
          </section>

          <div className="mt-20 pt-20 border-t border-forest/10" aria-hidden />

          {/* Section 4 — Recovery Care */}
          <section
            id="everyday-wellness"
            ref={(el) => { sectionRefs.current["everyday-wellness"] = el; }}
            className="care-section care-section-animate scroll-mt-28"
          >
            <h2 className="cc-heading-md text-darkgreen">Recovery Care</h2>
            <p className="care-body text-forest/90">
              Targeted recovery sessions designed to support how your body adapts to training, stress, and daily demands so you can sustain and improve your overall health.
            </p>
            <p className="care-label text-forest/60">
              Pillars
            </p>
            <div className="care-included-grid text-forest/90 !grid-cols-1">
              {EVERYDAY_WELLNESS_SERVICES.map((item, idx) => {
                const isOpen = openWellnessServices.has(idx);
                const buttonId = `wellness-service-toggle-${idx}`;
                const panelId = `wellness-service-panel-${idx}`;
                return (
                  <div key={item.title} className="relative">
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => toggleWellnessService(idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full flex items-start justify-between gap-3 text-left text-[16px] leading-relaxed text-darkgreen transition-colors group"
                    >
                      <span className="font-medium transition-colors group-hover:text-forest/70">
                        {item.title}
                      </span>
                      <span
                        aria-hidden
                        className="relative shrink-0 inline-flex items-center justify-center h-6 w-6 overflow-visible origin-center transition-colors duration-200 ease-out"
                      >
                        <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-forest/70 transition-colors group-hover:bg-forest/50" />
                        <span
                          className={`absolute left-1/2 top-1/2 w-px h-3.5 -translate-x-1/2 -translate-y-1/2 bg-forest/70 transition-colors transition-opacity transition-transform duration-200 group-hover:bg-forest/50 ${
                            isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      aria-hidden={!isOpen}
                      className={`mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[15px] leading-relaxed text-forest/90">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {idx < EVERYDAY_WELLNESS_SERVICES.length - 1 && (
                      <div aria-hidden className="h-px bg-forest/10 mt-2 mb-2" />
                    )}
                  </div>
                );
              })}
            </div>
            <CareEvaluationCarousel
              slides={WELLNESS_SLIDES}
              ariaLabel="Recovery Care imagery"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
