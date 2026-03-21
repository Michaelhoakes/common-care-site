"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "care-approach", label: "Care approach" },
  { id: "the-360-evaluation", label: "The 360° evaluation" },
  { id: "the-care-sessions", label: "The care sessions" },
  { id: "everyday-wellness", label: "Everyday wellness" },
] as const;

export default function CarePageClient() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [lineDrawn, setLineDrawn] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const revealedRef = useRef<Set<string>>(new Set());
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Draw sidebar line when two-column section enters viewport
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setLineDrawn(true);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scrollspy: set active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (id && SECTIONS.some((s) => s.id === id)) setActiveId(id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

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

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={sidebarRef} className="w-full px-16">
      <div className="max-w-[1400px] flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Sidebar: line draws on scroll in; dot centered on line */}
        <nav
          className="care-sidebar w-full lg:w-[200px] xl:w-[220px] shrink-0"
          aria-label="On this page"
        >
          <div className="sticky top-24 relative">
            <span
              className={`sidebar-nav-line absolute left-0 top-[10px] bottom-[10px] w-px bg-forest/20 ${lineDrawn ? "sidebar-nav-line-drawn" : ""}`}
              aria-hidden
            />
            <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:flex-col lg:gap-x-0 lg:gap-y-0 pl-6 w-fit">
              {SECTIONS.map(({ id, label }) => {
                const isActive = activeId === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(id)}
                      className={`
                        care-nav-link group relative flex items-center gap-3 py-2.5 pl-3 text-left text-base font-normal
                        transition-colors duration-200
                        ${isActive ? "text-forest" : "text-forest/70 hover:text-forest"}
                      `}
                    >
                      <span
                        className={`
                          absolute left-[-23.5px] top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200
                          ${isActive ? "bg-marigold" : "bg-transparent group-hover:bg-forest/30"}
                        `}
                        aria-hidden
                      />
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Content column */}
        <div className="min-w-0 flex-1 pb-24 md:pb-32 pt-8 lg:pt-0">
          {/* Section 1 — Care approach */}
          <section
            id="care-approach"
            ref={(el) => { sectionRefs.current["care-approach"] = el; }}
            className="care-section care-section-animate scroll-mt-28"
          >
            <h2 className="font-hero-display text-2xl md:text-3xl text-darkgreen font-medium tracking-normal">
              Care approach
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-forest/95 leading-snug max-w-2xl">
              Care begins with understanding you as a whole — not just a symptom.
            </p>
            <p className="mt-6 text-forest/90 text-[17px] leading-[1.65] max-w-2xl">
              We take a whole-person lens: how you move, how much stress and load you carry, and how you live day to day. That context shapes everything that follows. Care here is unhurried, one-on-one, and oriented toward long-term health — not quick fixes.
            </p>
            <ul className="mt-8 space-y-3 text-forest/90 text-[17px] leading-[1.6] max-w-2xl">
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
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium tracking-wide text-forest/80">
              <span>Listen</span>
              <span className="text-forest/50" aria-hidden>→</span>
              <span>Evaluate</span>
              <span className="text-forest/50" aria-hidden>→</span>
              <span>Guide</span>
            </div>
          </section>

          <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10" aria-hidden />

          {/* Section 2 — The 360° Evaluation */}
          <section
            id="the-360-evaluation"
            ref={(el) => { sectionRefs.current["the-360-evaluation"] = el; }}
            className="care-section care-section-animate scroll-mt-28 mt-20 md:mt-28"
          >
            <h2 className="font-hero-display text-2xl md:text-3xl text-darkgreen font-medium tracking-normal">
              The 360° evaluation
            </h2>
            <div className="mt-8 lg:mt-10 lg:flex lg:gap-16 xl:gap-20 lg:items-start">
              <div className="min-w-0 flex-1">
                <p className="text-xl md:text-2xl text-forest/95 leading-snug max-w-2xl">
                  A comprehensive baseline informed by clinical insight and objective measurement.
                </p>
                <p className="mt-6 text-forest/90 text-[17px] leading-[1.65] max-w-2xl">
                  Before we recommend treatment or next steps, we build a clear picture. The 360° evaluation is that baseline: it combines conversation, hands-on assessment, and measured data so we’re not guessing — we’re deciding from clarity.
                </p>
                <p className="mt-6 text-xs font-mono font-medium tracking-widest uppercase text-forest/60">
                  What’s included
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-forest/90 text-[17px] leading-[1.5]">
                  <div>Movement + gait analysis</div>
                  <div>Postural + mobility assessment</div>
                  <div>Strength + asymmetry testing</div>
                  <div>Body composition analysis (InBody)</div>
                  <div>Recovery + stress-load context</div>
                  <div>Goals + health history</div>
                </div>
                <p className="mt-8 text-forest/90 text-[17px] leading-[1.65] max-w-2xl">
                  Technology supports clinical judgment and reduces guesswork. We use it to see what the eye can’t fully capture — then we interpret it in the context of your life and goals.
                </p>
                <div className="mt-10 p-6 rounded-lg border border-forest/10 bg-pistachio/5">
                  <p className="text-xs font-mono font-medium tracking-widest uppercase text-forest/60 mb-3">
                    You’ll leave with
                  </p>
                  <ul className="space-y-2 text-forest/90 text-[17px]">
                    <li>Clear priorities</li>
                    <li>Focused next-step plan</li>
                    <li>Practical guidance</li>
                  </ul>
                </div>
                <a
                  href="/technology"
                  className="mt-8 inline-block text-forest font-medium text-[17px] border-b border-forest/30 hover:border-forest transition-colors"
                >
                  Explore how we measure →
                </a>
              </div>
              <div className="mt-12 lg:mt-0 lg:w-[320px] xl:w-[380px] shrink-0">
                <div
                  className="w-full aspect-[4/5] rounded-2xl overflow-hidden relative bg-forest/5"
                >
                  <img
                    src="/images/_DSF8105.jpeg"
                    alt="Body composition and movement analysis on a screen"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: "saturate(0.9) contrast(1.05)" }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/10"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 opacity-[0.10] mix-blend-soft-light"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
                    }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10" aria-hidden />

          {/* Section 3 — The Care Sessions */}
          <section
            id="the-care-sessions"
            ref={(el) => { sectionRefs.current["the-care-sessions"] = el; }}
            className="care-section care-section-animate scroll-mt-28 mt-20 md:mt-28"
          >
            <h2 className="font-hero-display text-2xl md:text-3xl text-darkgreen font-medium tracking-normal">
              The care sessions
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-forest/95 leading-snug max-w-2xl">
              This is where the plan becomes practice.
            </p>
            <p className="mt-6 text-forest/90 text-[17px] leading-[1.65] max-w-2xl">
              Follow-up care is delivered in one-on-one sessions that put the evaluation into action. We re-test and reassess as you go, so the plan stays aligned with your progress. Sessions are 60–90 minutes by design — an intentional pace so we’re not rushing.
            </p>
            <ul className="mt-8 space-y-3 text-forest/90 text-[17px] leading-[1.6] max-w-2xl">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Targeted hands-on care + movement guidance</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Ongoing reassessment</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Clear communication of progress</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Structured progression</span>
              </li>
            </ul>
            <p className="mt-10 text-forest/80 text-[17px] leading-[1.65] max-w-2xl">
              60–90 minute sessions. Same clinician when possible. Clear takeaways between visits.
            </p>
          </section>

          <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10" aria-hidden />

          {/* Section 4 — Everyday Wellness */}
          <section
            id="everyday-wellness"
            ref={(el) => { sectionRefs.current["everyday-wellness"] = el; }}
            className="care-section care-section-animate scroll-mt-28 mt-20 md:mt-28"
          >
            <h2 className="font-hero-display text-2xl md:text-3xl text-darkgreen font-medium tracking-normal">
              Everyday wellness
            </h2>
            <p className="mt-6 text-xl md:text-2xl text-forest/95 leading-snug max-w-2xl">
              Support that holds up outside the clinic.
            </p>
            <p className="mt-6 text-forest/90 text-[17px] leading-[1.65] max-w-2xl">
              What you do between visits — recovery, movement, and how you manage load — matters as much as what we do in the room. We help you build habits and awareness that fit your life so the benefits of care extend into your week.
            </p>
            <p className="mt-8 text-xs font-mono font-medium tracking-widest uppercase text-forest/60">
              Pillars
            </p>
            <ul className="mt-3 space-y-2 text-forest/90 text-[17px] leading-[1.6] max-w-2xl">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Recovery rhythms</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Sustainable mobility + strength</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Stress-load awareness</span>
              </li>
            </ul>
            <p className="mt-6 text-forest/80 text-[17px] leading-[1.65] max-w-2xl">
              Example topics: sleep, breath, desk setup, travel routines, walking volume.
            </p>
            <div
              className="mt-12 w-full min-h-[40vh] rounded-2xl overflow-hidden bg-gradient-to-br from-dusty-blue/20 via-pistachio/15 to-matcha/10 relative"
              aria-hidden
            >
              <div
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
