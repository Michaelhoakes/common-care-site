"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCareParallaxScrollY } from "../../hooks/useCareParallaxScrollY";
import {
  useCareSidebarProgress,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../hooks/useCareSidebarProgress";
import StickySectionSubnav from "../../components/StickySectionSubnav";

/** Sidebar + scrollspy: overview first, then each care chapter (Seed-style persistent nav). */
const CARE_NAV_SECTIONS = [
  { id: "care-approach", label: "Overview" },
  { id: "the-360-evaluation", label: "Care Evaluation" },
  { id: "the-care-sessions", label: "Care Sessions" },
  { id: "everyday-wellness", label: "Wellness Care" },
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

type CarePhotoSlide = {
  src: string;
  alt: string;
  imageClassName?: string;
};

const INCLUDED_ITEMS: IncludedItem[] = [
  {
    title: "Posture analysis",
    description:
      "A clear view of how your body is aligned and moving—highlighting patterns that may be contributing to discomfort or limitation.",
  },
  {
    title: "Body composition",
    description:
      "A deeper look at muscle balance, inflammation, water balance, and visceral fat to understand how your body is built and where support may be needed.",
  },
  {
    title: "Brain activity (EEG)",
    description:
      "Insight into how your brain is functioning, helping us understand focus, recovery, and how your nervous system is regulating.",
  },
  {
    title: "Heart rate variability (HRV)",
    description:
      "A real-time measure of how your body responds to stress—giving us a window into recovery, resilience, and overall capacity.",
  },
];

const WELLNESS_SLIDES: readonly CarePhotoSlide[] = [
  {
    src: "/images/Redlight.jpeg",
    alt: "Red light therapy area used for recovery sessions at Common Care",
  },
  {
    src: "/images/Soundbed.jpg",
    alt: "Sound bed setup used for recovery and restorative wellness work",
    imageClassName: "object-cover object-[center_72%]",
  },
];

const CARE_EVALUATION_PHOTOS: readonly CarePhotoSlide[] = [
  {
    src: "/images/exbody.jpg",
    alt: "InBody-style body composition readout and analysis context",
  },
  {
    src: "/images/treatment2.jpg",
    alt: "Hands-on clinical assessment and treatment",
  },
];

const CARE_SESSION_SERVICES: ServiceItem[] = [
  {
    title: "Hands-on treatment",
    description:
      "Targeted manual therapy to address restrictions, reduce discomfort, and improve how your body moves.",
  },
  {
    title: "Movement and strength work",
    description:
      "Guided exercises tailored to your body, helping you rebuild strength, control, and more efficient movement.",
  },
  {
    title: "Integrated technology",
    description:
      "Advanced tools used throughout your sessions to support treatment, recovery, and overall function.",
  },
  {
    title: "Progression and adjustment",
    description:
      "Your care evolves with you. Each session is adjusted based on how your body responds.",
  },
];

const EVERYDAY_WELLNESS_SERVICES: ServiceItem[] = [
  {
    title: "Hyperbaric oxygen therapy (HBOT)",
    description:
      "Increases oxygen delivery to tissues, supporting cellular repair, reducing inflammation, and improving recovery from both physical and mental stress.",
  },
  {
    title: "Red light therapy",
    description:
      "Supports mitochondrial function and reduces inflammation, helping improve tissue health, energy levels, and recovery.",
  },
  {
    title: "Sound and vibration therapy",
    description:
      "Uses auditory and sensory input—guided audio and gentle vibration—to help shift your nervous system out of a stressed state, supporting relaxation, focus, and improved recovery.",
  },
  {
    title: "Compression therapy",
    description:
      "Enhances circulation and lymphatic flow, helping reduce swelling, improve recovery, and support how your body handles daily physical load.",
  },
  {
    title: "Infrared sauna",
    description:
      "Increases circulation and promotes heat-based stress adaptation, supporting cardiovascular health, relaxation, and detoxification pathways.",
  },
  {
    title: "PEMF therapy",
    description:
      "Delivers low-frequency electromagnetic stimulation to support cellular signaling, reduce inflammation, and promote recovery at a tissue level.",
  },
  {
    title: "Cupping therapy",
    description:
      "Improves local circulation and reduces muscle tension, helping restore mobility and relieve areas of restriction.",
  },
  {
    title: "Percussive therapy",
    description:
      "Uses targeted vibration to reduce muscle stiffness, improve blood flow, and help your body relax more effectively.",
  },
];

function CareTwoColPhotoGrid({
  slides,
  ariaLabel,
}: {
  slides: readonly CarePhotoSlide[];
  ariaLabel: string;
}) {
  return (
    <div
      className="mt-10 md:mt-12 pb-6 md:pb-8 lg:pb-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full"
      role="group"
      aria-label={ariaLabel}
    >
      {slides.map((slide, i) => (
        <div key={slide.src} className="min-w-0">
          <div className="relative aspect-[4/3] w-full min-h-0 overflow-hidden rounded-xl bg-forest/5">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className={slide.imageClassName ?? "object-cover object-center"}
              sizes="(max-width: 639px) 100vw, (max-width: 1024px) 45vw, 560px"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

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

  const scrollSectionIntoView = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    const onHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = decodeURIComponent(raw);
      if (!CARE_SECTION_IDS.includes(id)) return;
      requestAnimationFrame(() => scrollSectionIntoView(id));
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [scrollSectionIntoView]);

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

  const scrollTo = (id: string) => scrollSectionIntoView(id);

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
      <div className="mx-auto max-w-[1400px] mt-0 lg:mt-20 flex flex-col lg:flex-row lg:gap-20 xl:gap-24 lg:items-stretch">
        <StickySectionSubnav
          sections={CARE_NAV_SECTIONS}
          activeId={activeId}
          onSelect={scrollTo}
          ariaLabel="On this page"
        />
        {/* Sidebar: vertical progress + links (desktop only); mobile uses StickySectionSubnav */}
        <nav
          className="care-sidebar hidden lg:block w-full lg:w-[260px] xl:w-[280px] shrink-0"
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
              Care begins with understanding you as a whole. We consider your symptoms, your story, and your goals. During your Care Evaluation, we combine your experience with objective data to shape a care plan built entirely around you and your needs.
            </h2>
            <ul className="care-list text-forest/90">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>A whole-person view of how your body is functioning</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>One-on-one care, unrushed and focused on you</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Advanced technology, integrated into every session</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Care that goes beyond pain</span>
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
                A detailed look at your health, starting with your story and supported by objective data. We bring these together to understand how your body is functioning and to shape care built specifically around you.
              </p>
              <CareTwoColPhotoGrid
                slides={CARE_EVALUATION_PHOTOS}
                ariaLabel="Care Evaluation imagery"
              />
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
                        className={`mt-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-2 pb-4">
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
              <div className="mt-10 pb-6 md:pb-8 lg:pb-10 w-full max-w-none">
                <div className="overflow-hidden rounded-xl bg-forest/[0.03]">
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
              </div>
              <p className="care-label text-forest/60 mt-10 md:mt-12">
                What happens in a session
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
                        className={`mt-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-4">
                            <p className="text-[15px] leading-relaxed text-forest/90">
                              {item.description}
                            </p>
                          </div>
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

          {/* Section 4 — Wellness Care */}
          <section
            id="everyday-wellness"
            ref={(el) => { sectionRefs.current["everyday-wellness"] = el; }}
            className="care-section care-section-animate scroll-mt-28"
          >
            <h2 className="cc-heading-md text-darkgreen">Wellness Care</h2>
            <p className="care-body text-forest/90">
              Wellness Care sessions are designed for those who aren’t necessarily in pain, but know their body could feel and function better. Using advanced technologies, we support how your body responds to stress, recovers from daily demands, and settles into a more balanced state over time.
            </p>
            <CareTwoColPhotoGrid
              slides={WELLNESS_SLIDES}
              ariaLabel="Wellness Care imagery"
            />
            <p className="care-label text-forest/60 mt-10 md:mt-12">
              What’s included
            </p>
            <p className="care-body text-forest/90 mt-3 max-w-3xl">
              Each session is guided and personalized. Based on what your body needs that day, we may use a combination of the following:
            </p>
            <div className="care-included-grid text-forest/90 !grid-cols-1 mt-6 md:mt-8">
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
                      className={`mt-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-4">
                          <p className="text-[15px] leading-relaxed text-forest/90">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {idx < EVERYDAY_WELLNESS_SERVICES.length - 1 && (
                      <div aria-hidden className="h-px bg-forest/10 mt-2 mb-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
