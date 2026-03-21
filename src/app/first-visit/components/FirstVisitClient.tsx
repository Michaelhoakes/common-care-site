"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SECTIONS = [
  { id: "what-to-expect", label: "What happens during your visit" },
  { id: "how-to-prepare", label: "How to prepare" },
  { id: "what-to-bring", label: "What to bring" },
  { id: "parking-arrival", label: "Parking & arrival" },
  { id: "insurance-payment", label: "Insurance & payment" },
  { id: "faqs", label: "FAQs" },
] as const;

const FAQ_ITEMS = [
  {
    q: "How long is the first visit?",
    a: "Your first visit is typically 60–90 minutes. We use the time to understand your history, run through the evaluation, and discuss next steps — no rush.",
  },
  {
    q: "Do I need a referral?",
    a: "No. You can book directly. If you have relevant imaging or notes from another provider, bring them — they can help us understand your picture.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Contact us as soon as you can. We ask for at least 24 hours’ notice when possible so we can offer the slot to someone else.",
  },
  {
    q: "Will I get exercises or homework?",
    a: "Often, yes. We’ll give you clear next steps — exercises, posture cues, or habits — to work on between visits so progress continues at home.",
  },
  {
    q: "Can I bring someone with me?",
    a: "Yes. If you’d like a family member or friend in the room, that’s fine. Let us know when you book or when you arrive.",
  },
  {
    q: "What happens after the first visit?",
    a: "We’ll outline a plan and next steps before you leave. That might mean follow-up sessions, home support, or both — depending on what’s right for you.",
  },
];

export default function FirstVisitClient() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [lineDrawn, setLineDrawn] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (id && SECTIONS.some((s) => s.id === id)) setActiveId(id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 }
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
        <nav
          className="care-sidebar w-full lg:w-[200px] xl:w-[220px] shrink-0"
          aria-label="On this page"
        >
          <div className="sticky top-24 relative">
            <span
              className={`sidebar-nav-line absolute left-0 top-2 bottom-2 w-px bg-forest/20 ${lineDrawn ? "sidebar-nav-line-drawn" : ""}`}
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
                        group relative flex items-center gap-3 py-2 pl-3 text-left text-[15px] font-normal
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

        <div className="min-w-0 flex-1 pb-20 md:pb-28 pt-6 lg:pt-0">
          {/* What happens during your visit */}
          <section
            id="what-to-expect"
            ref={(el) => { sectionRefs.current["what-to-expect"] = el; }}
            className="scroll-mt-28"
          >
            <h2 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              What happens during your visit
            </h2>
            <p className="mt-4 text-forest/90 text-[16px] leading-[1.65] max-w-2xl">
              Your first visit is 60–90 minutes. We use that time to understand your history, run through the evaluation, and make sure you leave with clear next steps.
            </p>
            <ol className="mt-6 space-y-4 max-w-2xl">
              <li className="flex gap-4">
                <span className="text-matcha font-medium text-[16px] shrink-0">1.</span>
                <div>
                  <span className="font-medium text-forest/95">Conversation about history and goals.</span>
                  <span className="text-forest/85 text-[16px]"> We’ll talk through what brought you in, your goals, and any relevant health history.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-matcha font-medium text-[16px] shrink-0">2.</span>
                <div>
                  <span className="font-medium text-forest/95">Movement assessment.</span>
                  <span className="text-forest/85 text-[16px]"> We’ll look at how you move — posture, gait, and relevant tests — to build a clear picture.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-matcha font-medium text-[16px] shrink-0">3.</span>
                <div>
                  <span className="font-medium text-forest/95">Hands-on or guided care.</span>
                  <span className="text-forest/85 text-[16px]"> Depending on what we find, we may include manual therapy, movement guidance, or both.</span>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-matcha font-medium text-[16px] shrink-0">4.</span>
                <div>
                  <span className="font-medium text-forest/95">Clear next steps before you leave.</span>
                  <span className="text-forest/85 text-[16px]"> We’ll summarize what we’re seeing and what we recommend — follow-up sessions, home support, or both.</span>
                </div>
              </li>
            </ol>
          </section>

          <div className="mt-16 md:mt-20 pt-12 border-t border-forest/10" aria-hidden />

          {/* How to prepare */}
          <section
            id="how-to-prepare"
            ref={(el) => { sectionRefs.current["how-to-prepare"] = el; }}
            className="scroll-mt-28 mt-14 md:mt-16"
          >
            <h2 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              How to prepare
            </h2>
            <p className="mt-4 text-forest/90 text-[16px] leading-[1.65] max-w-2xl">
              No special preparation required. A few simple things help:
            </p>
            <ul className="mt-5 space-y-2 text-forest/90 text-[16px] leading-[1.6] max-w-2xl">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Wear comfortable clothing you can move in.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Bring any relevant medical history or imaging (if you have it).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Arrive a few minutes early so you’re not rushed.</span>
              </li>
            </ul>
            <p className="mt-6 text-forest/80 text-[15px] leading-[1.6] max-w-2xl">
              That’s it. We’ll guide you through the rest.
            </p>
          </section>

          <div className="mt-16 md:mt-20 pt-12 border-t border-forest/10" aria-hidden />

          {/* What to bring */}
          <section
            id="what-to-bring"
            ref={(el) => { sectionRefs.current["what-to-bring"] = el; }}
            className="scroll-mt-28 mt-14 md:mt-16"
          >
            <h2 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              What to bring
            </h2>
            <ul className="mt-5 space-y-2 text-forest/90 text-[16px] leading-[1.6] max-w-2xl">
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>ID</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Insurance card (if you’re using insurance)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Any relevant documentation (referrals, imaging reports, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-matcha shrink-0" aria-hidden>—</span>
                <span>Comfortable shoes and clothing</span>
              </li>
            </ul>
          </section>

          <div className="mt-16 md:mt-20 pt-12 border-t border-forest/10" aria-hidden />

          {/* Parking & arrival */}
          <section
            id="parking-arrival"
            ref={(el) => { sectionRefs.current["parking-arrival"] = el; }}
            className="scroll-mt-28 mt-14 md:mt-16"
          >
            <h2 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              Parking & arrival
            </h2>
            <p className="mt-4 text-forest/90 text-[16px] leading-[1.65] max-w-2xl">
              [Placeholder: Parking is available in the building lot or street parking nearby. We’ll send specific directions and access instructions when you book.]
            </p>
            <p className="mt-5 text-forest/90 text-[16px] leading-[1.65] max-w-2xl">
              Plan to arrive about 5 minutes early. If you have trouble finding us or need building access, give us a call.
            </p>
          </section>

          <div className="mt-16 md:mt-20 pt-12 border-t border-forest/10" aria-hidden />

          {/* Insurance & payment */}
          <section
            id="insurance-payment"
            ref={(el) => { sectionRefs.current["insurance-payment"] = el; }}
            className="scroll-mt-28 mt-14 md:mt-16"
          >
            <h2 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              Insurance & payment
            </h2>
            <p className="mt-4 text-forest/90 text-[16px] leading-[1.65] max-w-2xl">
              We operate on a cash-based model and can provide documentation for you to submit to your insurer if you have out-of-network benefits. If you’re not sure about coverage, we offer an eligibility check — we’ll look into your benefits and follow up within 24 hours.
            </p>
            <Link
              href="/insurance#eligibility"
              className="mt-6 inline-block text-forest font-medium text-[16px] border-b border-forest/30 hover:border-forest transition-colors"
            >
              Check insurance eligibility →
            </Link>
          </section>

          <div className="mt-16 md:mt-20 pt-12 border-t border-forest/10" aria-hidden />

          {/* FAQs */}
          <section
            id="faqs"
            ref={(el) => { sectionRefs.current["faqs"] = el; }}
            className="scroll-mt-28 mt-14 md:mt-16"
          >
            <h2 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              FAQs
            </h2>
            <div className="mt-6 max-w-2xl space-y-0 border-t border-forest/10">
              {FAQ_ITEMS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border-b border-forest/10"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full py-4 pr-8 text-left flex items-start justify-between gap-4 group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-forest/95 text-[16px] font-medium leading-snug">
                        {faq.q}
                      </span>
                      <span
                        className={`shrink-0 text-forest/60 text-lg transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-out first-visit-faq-content ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-4 text-forest/85 text-[15px] leading-[1.65]">
                          {faq.a}
                        </p>
                      </div>
                    </div>
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
