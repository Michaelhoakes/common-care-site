"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import SmoothHashLink from "../../components/SmoothHashLink";
import {
  useCareSidebarProgress,
  useMediaQuery,
  usePrefersReducedMotion,
} from "../../care/hooks/useCareSidebarProgress";
import StickySectionSubnav from "../../components/StickySectionSubnav";
import InsuranceVerificationForm from "./InsuranceVerificationForm";
import type { CareSidebarProgress } from "../../care/hooks/useCareSidebarProgress";

const INSURANCE_NAV_SECTIONS = [
  { id: "how-it-works", label: "How it works" },
  { id: "insurance-basics", label: "Insurance basics" },
  { id: "eligibility", label: "Check your benefits" },
] as const;

const INSURANCE_SECTION_IDS: readonly string[] = INSURANCE_NAV_SECTIONS.map(
  (s) => s.id
);

const HOW_IT_WORKS_STEPS = [
  {
    title: "Submit your information",
    body: "Share your insurance details through our secure form so we can begin the process.",
  },
  {
    title: "We verify your benefits",
    body: "Our team reviews your out-of-network benefits and gathers the details that matter.",
  },
  {
    title: "We walk you through your coverage",
    body: "We explain what your plan covers and what you can expect to pay so there are no surprises.",
  },
  {
    title: "We handle the claims",
    body: "If you move forward, our billing team submits all claims on your behalf.",
  },
] as const;

const INSURANCE_BASICS_ITEMS: { term: string; definition: ReactNode }[] = [
  {
    term: "Out-of-network",
    definition: (
      <div className="flex flex-col gap-2 [&_p]:!m-0">
        <p>
          Care provided by a clinic that is not contracted with your insurance.
          This allows us to prioritize quality of care over volume, giving you
          more time, attention, and a more personalized experience.
        </p>
        <p>Out-of-network benefits vary by plan, but typically include:</p>
        <ul className="care-list text-forest/90 list-none p-0 space-y-4 [&>li]:!m-0">
          <li className="flex gap-3">
            <span className="text-matcha shrink-0" aria-hidden>
              —
            </span>
            <span>A deductible that must be met first</span>
          </li>
          <li className="flex gap-3">
            <span className="text-matcha shrink-0" aria-hidden>
              —
            </span>
            <span>A percentage of reimbursement after the deductible</span>
          </li>
          <li className="flex gap-3">
            <span className="text-matcha shrink-0" aria-hidden>
              —
            </span>
            <span>Reimbursement sent directly to you</span>
          </li>
        </ul>
        <p>
          We&apos;ll explain all of this clearly so there are no surprises.
        </p>
      </div>
    ),
  },
  {
    term: "Deductible",
    definition:
      "The amount you need to pay out of pocket before your insurance begins to contribute.",
  },
  {
    term: "Coinsurance",
    definition:
      "The percentage of the cost you're responsible for after your deductible has been met. This percentage is based on your insurance's allowed amount.",
  },
  {
    term: "Allowed amount",
    definition:
      "The rate your insurance uses to determine how much they will reimburse for a service. We can typically estimate this during your benefits check, though the final amount is determined once your claim is processed.",
  },
  {
    term: "Reimbursement",
    definition:
      "The portion of your care that your insurance pays back to the clinic after a claim is submitted.",
  },
  {
    term: "Claim",
    definition:
      "A request submitted to your insurance for reimbursement after your visit.",
  },
];

function getReadingLineRatio(): number {
  return 0.36;
}

export default function InsuranceClient() {
  const isDesktopNav = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = usePrefersReducedMotion();

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const getSectionEl = useCallback(
    (id: string) => sectionRefs.current[id] ?? null,
    []
  );

  const sidebarProgress: CareSidebarProgress = useCareSidebarProgress(
    INSURANCE_SECTION_IDS,
    getSectionEl,
    {
      enabled: isDesktopNav,
      readingLineRatio: getReadingLineRatio(),
      reduceMotion: prefersReducedMotion,
    }
  );

  const [mobileActiveId, setMobileActiveId] = useState<string>(
    INSURANCE_NAV_SECTIONS[0].id
  );
  const activeId = isDesktopNav ? sidebarProgress.activeId : mobileActiveId;

  const mobileScrollSpyRef = useRef<IntersectionObserver | null>(null);

  const scrollTo = useCallback(
    (id: string, opts?: { instant?: boolean }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const instant = opts?.instant || prefersReducedMotion;
      el.scrollIntoView({
        behavior: instant ? "auto" : "smooth",
        block: "start",
      });
    },
    [prefersReducedMotion]
  );

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
              INSURANCE_NAV_SECTIONS.some((s) => s.id === sid)
            ) {
              setMobileActiveId(sid);
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );

      INSURANCE_NAV_SECTIONS.forEach(({ id }) => {
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

  useEffect(() => {
    const onHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = decodeURIComponent(raw);
      if (!INSURANCE_SECTION_IDS.includes(id)) return;
      requestAnimationFrame(() => scrollTo(id, { instant: true }));
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [scrollTo]);

  return (
    <div className="w-full px-6 md:px-16">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="cc-heading-compact text-darkgreen max-w-3xl">
          Insurance
        </h1>
        <p className="care-body text-forest/90 max-w-3xl">
          We are an out-of-network provider. This allows us to deliver
          more personalized, one-on-one care without the limitations of
          insurance-based models.
        </p>

        <div className="mt-8">
          <SmoothHashLink
            href="/insurance#eligibility"
            className="cc-btn-primary px-5 py-3"
          >
            Check insurance
          </SmoothHashLink>
        </div>
      </div>

      <div
        className="mx-auto max-w-[1400px] mt-10 pt-0 md:mt-20 md:pt-20 border-t-0 md:border-t md:border-forest/10"
        aria-hidden
      />

      <div className="mx-auto max-w-[1400px] flex flex-col lg:flex-row lg:gap-20 xl:gap-24 lg:items-stretch">
        <StickySectionSubnav
          sections={INSURANCE_NAV_SECTIONS}
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
                {INSURANCE_NAV_SECTIONS.map(({ id, label }, index) => {
                  const fill = isDesktopNav ? sidebarProgress.fills[index] ?? 0 : 0;
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

        <div className="min-w-0 flex-1 pb-24 md:pb-32 pt-8 lg:pt-0">
          <section
            id="how-it-works"
            ref={(el) => {
              sectionRefs.current["how-it-works"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">How it works</h2>
            <p className="care-body text-forest/90 max-w-3xl">
              We verify your benefits and explain your coverage—so you know
              exactly what to expect before getting started. Most responses
              are provided within 24 hours.
            </p>
            <ol className="care-list text-forest/90 mt-8 flex flex-col gap-4 list-none p-0 max-w-3xl [&>li+li]:!m-0">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 items-start"
                >
                  <span className="text-matcha font-medium shrink-0 leading-[1.6]">
                    {index + 1}.
                  </span>
                  <div className="min-w-0 flex flex-col gap-1.5">
                    <span className="font-medium text-forest/95 block">
                      {step.title}
                    </span>
                    <p className="!m-0 text-forest/85 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-forest/65 !mb-0">
              In some cases, insurance reimbursements may be sent directly to
              you. If this happens, those payments are intended for the
              clinic and can be forwarded once received.
            </p>
          </section>

          <div
            className="mt-8 pt-8 md:mt-20 md:pt-20 border-t border-forest/10"
            aria-hidden
          />

          <section
            id="insurance-basics"
            ref={(el) => {
              sectionRefs.current["insurance-basics"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">Insurance basics</h2>
            <p className="care-body text-forest/90 max-w-3xl">
              A few common terms to help you better understand your coverage.
            </p>
            <dl className="mt-8 md:mt-10 space-y-8 md:space-y-10 max-w-3xl">
              {INSURANCE_BASICS_ITEMS.map((item) => (
                <div key={item.term} className="min-w-0">
                  <dt className="font-medium text-forest/95 m-0 text-base leading-snug md:text-[17px] md:leading-relaxed">
                    {item.term}
                  </dt>
                  <dd className="care-body text-forest/90 mt-1.5 md:mt-2 !mb-0 !ml-0">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div
            className="mt-8 pt-8 md:mt-20 md:pt-20 border-t border-forest/10"
            aria-hidden
          />

          <section
            id="eligibility"
            ref={(el) => {
              sectionRefs.current["eligibility"] = el;
            }}
            className="care-section scroll-mt-28"
          >
            <h2 className="cc-heading-md">Check your benefits</h2>
            <p className="care-body text-forest/90 max-w-3xl">
              We offer a complimentary insurance benefits check and help you
              understand your coverage within 24 hours.
            </p>
            <div id="insurance-check-form">
              <InsuranceVerificationForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

