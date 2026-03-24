"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCareParallaxScrollY } from "../../hooks/useCareParallaxScrollY";
import {
  useCareSidebarProgress,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../../care/hooks/useCareSidebarProgress";

const FIRST_VISIT_NAV_SECTIONS = [
  { id: "what-to-expect", label: "What happens during your visit" },
  { id: "how-to-prepare", label: "How to prepare" },
  { id: "parking-arrival", label: "Parking & arrival" },
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
      "Your first visit is typically 60–90 minutes. We use the time to understand your history, run through the evaluation, and discuss next steps — no rush.",
  },
  {
    title: "Do I need a referral?",
    description:
      "No. You can book directly. If you have relevant imaging or notes from another provider, bring them — they can help us understand your picture.",
  },
  {
    title: "What if I need to reschedule?",
    description:
      "Contact us as soon as you can. We ask for at least 24 hours’ notice when possible so we can offer the slot to someone else.",
  },
  {
    title: "Will I get exercises or homework?",
    description:
      "Often, yes. We’ll give you clear next steps — exercises, posture cues, or habits — to work on between visits so progress continues at home.",
  },
  {
    title: "What happens after the first visit?",
    description:
      "We’ll outline a plan and next steps before you leave. That might mean follow-up sessions, home support, or both — depending on what’s right for you.",
  },
];

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
      <div className="mx-auto max-w-[1400px] mt-14 md:mt-18 lg:mt-20 flex flex-col lg:flex-row lg:gap-20 xl:gap-24 lg:items-stretch">
        <nav
          className="care-sidebar w-full lg:w-[260px] xl:w-[280px] shrink-0"
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
            <h3>What happens during your visit</h3>
            <p className="care-body text-forest/90">
              Your first visit is 60–90 minutes. We use that time to understand
              your history, run through the evaluation, and make sure you leave
              with clear next steps.
            </p>
            <div className="mt-8 w-full max-w-none overflow-hidden rounded-xl border border-forest/10 bg-forest/[0.03]">
              <div className="relative aspect-[21/9] min-h-[220px] w-full sm:aspect-[2/1] md:min-h-[280px]">
                <img
                  src="/images/treatmenttable1.jpg"
                  alt="Clinic treatment room and arrival environment"
                  className="absolute inset-0 h-full w-full object-cover object-center scale-[1.06]"
                  loading="lazy"
                  sizes="(min-width: 1400px) 1400px, 100vw"
                />
              </div>
            </div>
            <ol className="care-list text-forest/90 mt-6">
              <li className="flex gap-4">
                <span className="text-matcha font-medium shrink-0">1.</span>
                <div>
                  <span className="font-medium text-forest/95">
                    Conversation about history and goals.
                  </span>
                  <span className="text-forest/85">
                    {" "}
                    We’ll talk through what brought you in, your goals, and any
                    relevant health history.
                  </span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-matcha font-medium shrink-0">2.</span>
                <div>
                  <span className="font-medium text-forest/95">
                    Movement assessment.
                  </span>
                  <span className="text-forest/85">
                    {" "}
                    We’ll look at how you move — posture, gait, and relevant
                    tests — to build a clear picture.
                  </span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-matcha font-medium shrink-0">3.</span>
                <div>
                  <span className="font-medium text-forest/95">
                    Hands-on or guided care.
                  </span>
                  <span className="text-forest/85">
                    {" "}
                    Depending on what we find, we may include manual therapy,
                    movement guidance, or both.
                  </span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-matcha font-medium shrink-0">4.</span>
                <div>
                  <span className="font-medium text-forest/95">
                    Clear next steps before you leave.
                  </span>
                  <span className="text-forest/85">
                    {" "}
                    We’ll summarize what we’re seeing and what we recommend —
                    follow-up sessions, home support, or both.
                  </span>
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
            <h3>How to prepare</h3>
            <p className="care-body text-forest/90">
              No special preparation required. A few simple things help:
            </p>
            <ul className="care-list text-forest/90 mt-5">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>
                  —
                </span>
                <span>Wear comfortable clothing you can move in.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>
                  —
                </span>
                <span>
                  Bring any relevant medical history or imaging (if you have
                  it).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>
                  —
                </span>
                <span>Arrive a few minutes early so you’re not rushed.</span>
              </li>
            </ul>
            <p className="care-body text-forest/80 mt-6">
              That’s it. We’ll guide you through the rest.
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
            <h3>Parking & arrival</h3>
            <p className="care-body text-forest/90">
              [Placeholder: Parking is available in the building lot or street
              parking nearby. We’ll send specific directions and access
              instructions when you book.]
            </p>
            <p className="care-body text-forest/90 mt-5">
              Plan to arrive about 5 minutes early. If you have trouble finding
              us or need building access, give us a call.
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
            <h3>Insurance & payment</h3>
            <p className="care-body text-forest/90">
              We operate on a cash-based model and can provide documentation for
              you to submit to your insurer if you have out-of-network benefits.
              If you’re not sure about coverage, we offer an eligibility check —
              we’ll look into your benefits and follow up within 24 hours.
            </p>
            <Link
              href="/insurance#eligibility"
              className="mt-6 care-link text-forest font-medium border-b border-forest/30 hover:border-forest transition-colors"
            >
              Check insurance eligibility →
            </Link>
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
            <h3>FAQs</h3>
            <div className="mt-6 min-w-0">
              <p className="care-body text-forest/90">
                Quick answers on timing, preparation, and what happens after
                your visit.
              </p>
              <div className="care-included-grid text-forest/90 !grid-cols-1">
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
                        className="w-full flex items-start justify-between gap-3 text-left text-[17px] leading-relaxed text-darkgreen transition-colors group"
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
                        className={`mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-2">
                            <p className="care-body text-forest/90 leading-relaxed">
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
