"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useCareParallaxScrollY } from "../../hooks/useCareParallaxScrollY";
import {
  useCareSidebarProgress,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../../care/hooks/useCareSidebarProgress";
import StickySectionSubnav from "../../components/StickySectionSubnav";

const FIRST_VISIT_NAV_SECTIONS = [
  { id: "what-to-expect", label: "What happens during your first visit" },
  { id: "how-to-prepare", label: "How to prepare" },
  { id: "parking-arrival", label: "Location & parking" },
  { id: "insurance-payment", label: "Insurance & payment" },
  { id: "faqs", label: "FAQs" },
] as const;

const FIRST_VISIT_SECTION_IDS: readonly string[] = FIRST_VISIT_NAV_SECTIONS.map(
  (s) => s.id
);

/** Same shape as /care “What’s included” items (title + description accordion). */
const FAQ_ITEMS: { title: string; description: string }[] = [
  {
    title: "How long is the first visit?",
    description:
      "Your first visit typically lasts 1.5 to 2 hours, allowing us enough time to fully understand you, complete the evaluation, and begin treatment.",
  },
  {
    title: "Do I need a referral?",
    description:
      "No referral is needed. You can book directly with us without one. If you have relevant imaging or notes from another provider, bring them—they can help us understand what’s going on.",
  },
  {
    title: "What should I wear to my first visit?",
    description:
      "Wear clothing that allows us to assess how your body moves. Shorts are recommended, and for women, a sports bra with yoga pants or shorts, or a loose-fitting top.",
  },
  {
    title: "Will I receive treatment during my first visit?",
    description:
      "Yes. In addition to the evaluation, we use the remaining time to begin treatment so you leave with a clearer understanding and already feeling a difference.",
  },
  {
    title: "Do you accept insurance?",
    description:
      "We are an out-of-network provider. We offer a complimentary benefits check and can help you understand your coverage and expected cost before getting started.",
  },
  {
    title: "What makes your approach different?",
    description:
      "We take the time to understand you fully, combining your story with objective data and delivering one-on-one care that is built entirely around you.",
  },
  {
    title: "What if I’m not currently in pain?",
    description:
      "Many of our clients come in to better understand their body, address underlying issues, or support how they feel and function day to day.",
  },
  {
    title: "Can I use my HSA or FSA?",
    description:
      "Yes, HSA and FSA funds can typically be used for our services.",
  },
];

function IconCoffeeCup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a3 3 0 0 1 0 6h-1" />
      <path d="M2 8h14v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

function IconWaterDrop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5c-3.5 5-6 8.62-6 11.5a6 6 0 0 0 12 0c0-2.88-2.5-6.5-6-11.5z" />
    </svg>
  );
}

export default function FirstVisitClient() {
  useCareParallaxScrollY();
  const isDesktopNav = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const getSectionEl = useCallback(
    (id: string) => sectionRefs.current[id] ?? null,
    []
  );
  const sidebarProgress = useCareSidebarProgress(
    FIRST_VISIT_SECTION_IDS,
    getSectionEl,
    {
      enabled: isDesktopNav,
      readingLineRatio: 0.36,
      reduceMotion: prefersReducedMotion,
    }
  );

  const [mobileActiveId, setMobileActiveId] = useState<string>(
    FIRST_VISIT_NAV_SECTIONS[0].id
  );
  const activeId = isDesktopNav ? sidebarProgress.activeId : mobileActiveId;
  // Match /care “What’s included”: multiple rows can be open at once
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(() => new Set());
  const mobileScrollSpyRef = useRef<IntersectionObserver | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

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
            if (
              sid &&
              FIRST_VISIT_NAV_SECTIONS.some((s) => s.id === sid)
            ) {
              setMobileActiveId(sid);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      FIRST_VISIT_NAV_SECTIONS.forEach(({ id }) => {
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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full px-6 md:px-16">
      <div className="mx-auto max-w-[1400px] mt-0 lg:mt-20 flex flex-col lg:flex-row lg:gap-20 xl:gap-24 lg:items-stretch">
        <StickySectionSubnav
          sections={FIRST_VISIT_NAV_SECTIONS}
          activeId={activeId}
          onSelect={scrollTo}
          ariaLabel="On this page"
        />
        <nav
          className="care-sidebar hidden lg:block w-full lg:w-[260px] xl:w-[280px] shrink-0"
          aria-label="On this page"
        >
          <div className="relative lg:h-full">
            <div className="sticky top-24 lg:top-28">
              <ul className="flex w-full max-w-full flex-wrap gap-x-6 gap-y-0.5 lg:grid lg:max-w-none lg:grid-cols-[0.75rem_minmax(0,1fr)] lg:gap-x-3 lg:gap-y-2">
                {FIRST_VISIT_NAV_SECTIONS.map(({ id, label }, index) => {
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

        <div className="min-w-0 flex-1 pb-24 md:pb-32 pt-8 md:pt-10 lg:pt-0">
          <section
            id="what-to-expect"
            ref={(el) => {
              sectionRefs.current["what-to-expect"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">
              What happens during your first visit
            </h2>
            <p className="care-body text-forest/90">
              Your first visit is focused on understanding you—your symptoms,
              your history, and how your body is functioning as a whole. We begin
              with a conversation, then move into a detailed evaluation using
              both hands-on assessment and objective data to guide your care
              moving forward.
            </p>
            <div className="mt-8 mb-8 w-full max-w-none overflow-hidden rounded-xl bg-forest/[0.03]">
              <div className="relative aspect-[21/9] min-h-[220px] w-full sm:aspect-[2/1] md:min-h-[280px]">
                <img
                  src="/images/consult1a.jpg"
                  alt="Care team consultation in the clinic treatment room"
                  className="absolute inset-0 h-full w-full object-cover object-center scale-[1.26]"
                  loading="lazy"
                  sizes="(min-width: 1400px) 1400px, 100vw"
                />
              </div>
            </div>
            <ol className="care-list text-forest/90 mt-0 flex flex-col gap-4 list-none p-0 [&>li+li]:!m-0">
              <li className="flex gap-4 items-start">
                <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                  1.
                </span>
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-forest/95 block">
                    Conversation
                  </span>
                  <p className="!m-0 text-forest/85 leading-relaxed">
                    We start by understanding what you&apos;re experiencing, your
                    history, and what you&apos;re hoping to get out of care.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                  2.
                </span>
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-forest/95 block">
                    Movement assessment
                  </span>
                  <p className="!m-0 text-forest/85 leading-relaxed">
                    We look at how your body moves, identifying patterns,
                    limitations, and areas that may be contributing to what
                    you&apos;re feeling.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                  3.
                </span>
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-forest/95 block">
                    Objective testing
                  </span>
                  <p className="!m-0 text-forest/85 leading-relaxed">
                    We gather data using advanced technologies to better
                    understand how different aspects of your health are
                    functioning.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                  4.
                </span>
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-forest/95 block">
                    Hands-on assessment
                  </span>
                  <p className="!m-0 text-forest/85 leading-relaxed">
                    We assess how your body feels and responds to touch, helping
                    us identify areas of tension, restriction, or imbalance.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                  5.
                </span>
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-forest/95 block">
                    Putting it all together
                  </span>
                  <p className="!m-0 text-forest/85 leading-relaxed">
                    We sit down with you to walk through what the data shows and
                    how it connects to what you&apos;ve shared, then outline a
                    clear plan for moving forward.
                  </p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                  6.
                </span>
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="font-medium text-forest/95 block">
                    Initial treatment
                  </span>
                  <p className="!m-0 text-forest/85 leading-relaxed">
                    We use the remaining time to begin addressing what we&apos;ve
                    found, so you leave with clarity and already feeling better.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <div
            className="mt-20 pt-20 border-t border-forest/10"
            aria-hidden
          />

          <section
            id="how-to-prepare"
            ref={(el) => {
              sectionRefs.current["how-to-prepare"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">How to prepare</h2>
            <p className="care-body text-forest/90">
              A few simple steps ahead of your visit can help ensure your
              evaluation is as accurate and informative as possible.
            </p>
            <ul className="care-list text-forest/90 mt-5 space-y-4">
              <li className="flex gap-3 items-start">
                <span
                  className="mt-0.5 flex shrink-0 text-forest/65"
                  aria-hidden
                >
                  <CheckCircleIcon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span>
                  Wear clothing that allows us to assess how your body moves.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span
                  className="mt-0.5 flex shrink-0 text-forest/65"
                  aria-hidden
                >
                  <IconCoffeeCup className="h-5 w-5" />
                </span>
                <span>
                  Avoid eating or caffeine for 3–4 hours beforehand.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span
                  className="mt-0.5 flex shrink-0 text-forest/65"
                  aria-hidden
                >
                  <IconWaterDrop className="h-5 w-5" />
                </span>
                <span>
                  Maintain normal hydration, but avoid drinking large amounts of
                  water right before your visit.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <span
                  className="mt-0.5 flex shrink-0 text-forest/65"
                  aria-hidden
                >
                  <DocumentTextIcon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span>
                  Bring any relevant imaging or reports, if available.
                </span>
              </li>
            </ul>
            <p className="care-body text-forest/90 mt-6">
              We recommend arriving a few minutes early to settle in, get
              comfortable, and complete any forms before your evaluation.
            </p>
          </section>

          <div
            className="mt-20 pt-20 border-t border-forest/10"
            aria-hidden
          />

          <section
            id="parking-arrival"
            ref={(el) => {
              sectionRefs.current["parking-arrival"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">Location & parking</h2>
            <p className="care-body text-forest/90">
              <a
                href="https://maps.google.com/?q=7551+Sunset+Blvd+Suite+201+West+Hollywood"
                target="_blank"
                rel="noopener noreferrer"
                className="cc-text-btn inline"
              >
                <strong>7551 Sunset Blvd #201 Los Angeles, CA 90046</strong>
              </a>
              <strong> (West Hollywood)</strong>
            </p>
            <p className="care-label text-forest/60 mt-10 md:mt-12 !mb-0">
              Finding us
            </p>
            <p className="care-body text-forest/90 !mt-3">
              You&apos;ll find us on the corner of Sierra Bonita and Sunset Blvd,
              around the corner from Dog E Den and across from John Kelly
              Chocolates. Enter through the front entrance and ring suite 201 at
              the intercom and you will be let in promptly.
            </p>
            <p className="care-label text-forest/60 mt-10 md:mt-12 !mb-0">
              Parking
            </p>
            <p className="care-body text-forest/90 !mt-3">
              Street parking is available, with ample parking typically found
              along Sierra Bonita. Metered 10-hour parking is also available
              directly in front of the building.
            </p>
          </section>

          <div
            className="mt-20 pt-20 border-t border-forest/10"
            aria-hidden
          />

          <section
            id="insurance-payment"
            ref={(el) => {
              sectionRefs.current["insurance-payment"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">Insurance & payment</h2>
            <p className="care-body text-forest/90 !mb-0">
              We are an out-of-network provider. If you&apos;d like to use your
              insurance, we offer a complimentary benefits check and typically
              respond within 24 hours with a clear understanding of your
              coverage and expected cost.
            </p>
            <Link
              href="/insurance#eligibility"
              className="mt-2 inline-flex cc-text-btn"
            >
              Check insurance eligibility →
            </Link>
            <p className="care-body text-forest/90 mt-5">
              If you choose to move forward, our billing team handles claim
              submissions on your behalf—so you don&apos;t have to navigate
              the process on your own.
            </p>
            <div className="mt-6">
              <p className="care-body text-forest/90 !mt-0 !mx-0 !mb-1">
                If you&apos;re paying <strong>out of pocket</strong>, our rates
                are:
              </p>
              <ul className="care-list text-forest/90 mt-3 flex flex-col gap-1.5 [&>li]:!m-0">
                <li>Care Evaluation: $225</li>
                <li>Care Sessions: $175</li>
                <li>Wellness Care: $125</li>
              </ul>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-forest/65 !mb-0">
              Care Evaluations and Care Sessions are conducted one-on-one with
              a Doctor of Physical Therapy. Wellness Care is guided by a trained
              Care Specialist as part of your plan of care.
            </p>
          </section>

          <div
            className="mt-20 pt-20 border-t border-forest/10"
            aria-hidden
          />

          <section
            id="faqs"
            ref={(el) => {
              sectionRefs.current["faqs"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">FAQs</h2>
            <div className="min-w-0">
              <p className="care-body text-forest/90">
                Common questions about your first visit.
              </p>
              <div className="care-included-grid text-forest/90 !grid-cols-1 mt-6 md:mt-8">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = openFaqs.has(idx);
                  const buttonId = `faq-toggle-${idx}`;
                  const panelId = `faq-panel-${idx}`;
                  return (
                    <div key={item.title} className="relative">
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleFaq(idx)}
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
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-2 pb-4">
                            <p className="text-[15px] leading-relaxed text-forest/90">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {idx < FAQ_ITEMS.length - 1 && (
                        <div
                          aria-hidden
                          className="h-px bg-forest/10 mt-2 mb-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
