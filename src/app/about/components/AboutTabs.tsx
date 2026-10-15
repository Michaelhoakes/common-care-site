"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/** Hashes from mega menu / footer / shared URLs — tab sync + instant scroll to page top (no in-section jump). */
const ABOUT_NAV_HASHES = new Set([
  "care-team",
  "team",
  "what-we-believe",
  "what-we-value",
  "long-horizon",
  "what-guides-us",
]);

type AboutTab = "approach" | "team";

const TABS: { id: AboutTab; label: string }[] = [
  { id: "approach", label: "Who we are" },
  { id: "team", label: "Your care team" },
];

/** Fallback when header / tab strip can’t be measured. */
const TAB_PANEL_TOP_GUTTER_FALLBACK_PX = 120;
/** Extra space below measured chrome before panel content begins. */
const TAB_PANEL_BELOW_STICKY_GAP_PX = 20;

function ApproachPanel({
  id,
  labelledBy,
}: {
  id: string;
  labelledBy: string;
}) {
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="outline-none">
      <h2 className="sr-only">Who we are</h2>
      <div className="w-full min-w-0 max-w-[1180px]">
        <section
          id="what-we-believe"
          className="care-section scroll-mt-28 border-t border-forest/10 pt-8 md:pt-10"
          aria-labelledby="about-what-we-believe"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <p className="cc-eyebrow text-forest/55 !mb-0">01</p>
            <div className="min-w-0 max-w-3xl">
              <h3 id="about-what-we-believe" className="cc-heading-md max-w-5xl !mb-0">
                What should be common...isn&apos;t.
              </h3>
              <div className="mt-8 flex max-w-2xl flex-col gap-6 md:gap-8">
                <div className="text-group text-group--flush">
                  <p>
                    Most people have experienced care that feels rushed,
                    fragmented, or impersonal. Where you&apos;re treated for a
                    symptom - not understood as a whole person.
                  </p>
                  <p>That&apos;s not how we believe care should be.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="what-we-value"
          className="care-section scroll-mt-28 mt-10 border-t border-forest/10 pt-8 md:mt-14 md:pt-10"
          aria-labelledby="about-what-we-value"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <p className="cc-eyebrow text-forest/55 !mb-0">02</p>
            <div className="min-w-0 max-w-3xl">
              <h3 id="about-what-we-value" className="cc-heading-md max-w-2xl !mb-0">
                Built around you
              </h3>
              <div className="mt-8 max-w-2xl space-y-6">
                <div className="text-group text-group--flush">
                  <p>At Common Care, everything we do is built around one idea:</p>
                  <p className="font-medium">
                    No two people are the same. So no two plans should be either.
                  </p>
                  <p>
                    We take the time to understand you - your history, your
                    movement, your patterns, your goals. We combine hands-on
                    care, movement, and advanced technologies into one
                    integrated experience.
                  </p>
                  <p>Not a menu of services.</p>
                  <p>Not one-size-fits-all solutions.</p>
                  <p>But a plan designed specifically for you.</p>
                  <p>
                    Because real results don&apos;t come from one thing - they
                    come from the right combination of things, applied with
                    intention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="care-section scroll-mt-28 mt-10 border-t border-forest/10 pt-8 md:mt-14 md:pt-10"
          aria-labelledby="about-why-we-exist"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <p className="cc-eyebrow text-forest/55 !mb-0">03</p>
            <div className="min-w-0 max-w-3xl">
              <h3 id="about-why-we-exist" className="cc-heading-md max-w-2xl !mb-0">
                We exist to make good care common
              </h3>
              <div className="mt-8 max-w-2xl space-y-6">
                <div className="text-group text-group--flush">
                  <p>The name Common Care is intentional.</p>
                  <p>
                    Because the kind of care we provide - being listened to,
                    being understood, receiving thoughtful and personalized
                    treatment - should be common.
                  </p>
                  <p>But it isn&apos;t.</p>
                  <p>So we built a place where it is.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="care-section scroll-mt-28 mt-10 border-t border-forest/10 pt-8 md:mt-14 md:pt-10"
          aria-labelledby="about-what-we-believe-2"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <p className="cc-eyebrow text-forest/55 !mb-0">04</p>
            <div className="min-w-0 max-w-3xl">
              <h3 id="about-what-we-believe-2" className="cc-heading-md max-w-2xl !mb-0">
                Simplicity that works
              </h3>
              <div className="mt-8 max-w-2xl space-y-6">
                <div className="text-group text-group--flush">
                  <p>We believe in doing the simple things exceptionally well:</p>
                  <ul className="care-list text-forest/90">
                    <li>Listening before treating</li>
                    <li>Asking better questions</li>
                    <li>Using data to guide decisions</li>
                    <li>Creating space for people to feel safe</li>
                    <li>Showing up with consistency, every day</li>
                  </ul>
                  <p>Not because it&apos;s revolutionary - but because it works.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="care-section scroll-mt-28 mt-10 border-t border-forest/10 pt-8 md:mt-14 md:pt-10"
          aria-labelledby="about-different-kind"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <p className="cc-eyebrow text-forest/55 !mb-0">05</p>
            <div className="min-w-0 max-w-3xl">
              <h3 id="about-different-kind" className="cc-heading-md max-w-2xl !mb-0">
                Letting our actions speak louder than words
              </h3>
              <div className="mt-8 max-w-2xl space-y-6">
                <div className="text-group text-group--flush">
                  <p>
                    We&apos;re not here to be the loudest voice in healthcare.
                    We&apos;re here to do the work - quietly, consistently, and
                    exceptionally well.
                  </p>
                  <p>
                    Because when care is done right, you feel it. You don&apos;t
                    need to be convinced of it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="care-section scroll-mt-28 mt-10 border-t border-forest/10 pt-8 md:mt-14 md:pt-10"
          aria-labelledby="about-looking-forward"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <p className="cc-eyebrow text-forest/55 !mb-0">06</p>
            <div className="min-w-0 max-w-3xl">
              <h3 id="about-looking-forward" className="cc-heading-md max-w-2xl !mb-0">
                Looking forward
              </h3>
              <div className="mt-8 max-w-2xl space-y-6">
                <div className="text-group text-group--flush">
                  <p>We envision a future where care like this isn&apos;t rare.</p>
                  <p>
                    Where communities are built around health. Where people
                    don&apos;t have to think so hard about &ldquo;being healthy&rdquo;
                    - because their environment supports it.
                  </p>
                  <p>
                    Where care feels like something you&apos;re a part of - not
                    something you have to seek out.
                  </p>
                  <p className="font-medium">
                    This is what care should feel like. And we&apos;re here to
                    make it common.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 w-full min-w-0 border-t border-forest/10 pt-8 md:mt-12 md:pt-10 pb-[80px]">
        <div className="relative aspect-[16/9] w-full max-w-full overflow-hidden rounded-lg bg-forest/5 xl:max-w-[min(100%,1100px)] 2xl:max-w-[min(100%,1180px)]">
          <Image
            src="/images/Clinic-front2.jpg"
            alt="Common Care clinic entrance and storefront"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1100px"
          />
        </div>
      </div>
    </div>
  );
}

function CareTeamPanel({
  id,
  labelledBy,
}: {
  id: string;
  labelledBy: string;
}) {
  const credMeta =
    "font-mono text-[13px] tracking-[0.08em] uppercase text-darkgreen/80 leading-snug";

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="outline-none w-full min-w-0">
      <section
        id="care-team"
        className="care-section mt-14 md:mt-20 scroll-mt-44 lg:scroll-mt-28"
      >
        {/* Michael.jpg is 5333×4123 — layout uses intrinsic landscape ratio (no crop box). */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14 items-start lg:items-center gap-y-8 lg:gap-y-0">
          <header
            id="about-team-mobile-lead"
            className="lg:hidden min-w-0 scroll-mt-44"
          >
            <h3 className="cc-heading-md text-darkgreen !mt-0 !mb-1 max-w-[14ch] leading-[1.05]">
              Michael Oakes
            </h3>
            <p className={`${credMeta} !m-0`}>
              Doctor of Physical Therapy · Founder
            </p>
          </header>

          <div className="min-w-0 lg:col-span-5 xl:col-span-6">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl bg-forest/5 ring-1 ring-forest/[0.06]">
                <Image
                  src="/images/Michael.jpg"
                  alt="Michael Oakes, DPT"
                  width={5333}
                  height={4123}
                  className="w-full h-auto block"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7 xl:col-span-6 flex flex-col">
            <div className="hidden lg:block">
              <h3 className="cc-heading-md text-darkgreen !mt-0 !mb-1 max-w-[14ch] leading-[1.05]">
                Michael Oakes
              </h3>
              <p className={`${credMeta} !m-0`}>
                Doctor of Physical Therapy · Founder
              </p>
            </div>
            <div className="text-group text-group--flush max-w-2xl lg:max-w-none lg:mt-8">
              <p>
                Michael Oakes, DPT, is the founder of Common Care, a Los
                Angeles–based physical therapy practice built on a simple
                belief: <strong>care should feel personal</strong>.
              </p>
              <p>
                With over a decade of experience, he began his career in New York
                and completed advanced training through the North American
                Institute of Orthopedic Manual Therapy, developing a strong
                foundation in hands-on care.
              </p>
              <p>
                After seeing how often physical therapy becomes rushed,
                impersonal, and focused on symptoms rather than the individual, he
                founded Common Care to offer a more thoughtful approach.
              </p>
              <p>
                His work centers on understanding the person in front of him
                through conversation, hands-on assessment, and objective data,
                helping people move beyond pain and function at a higher level.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 md:mt-28 lg:mt-36">
        {/* Tommy-opt.jpg is 5568×4036 — same grid + intrinsic ratio pattern as Michael. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14 items-start lg:items-center gap-y-8 lg:gap-y-0">
          <header className="lg:hidden min-w-0">
            <h3 className="cc-heading-md text-darkgreen !mt-0 !mb-1 max-w-[14ch] leading-[1.05]">
              Tommy Wolfe
            </h3>
            <p className={`${credMeta} !m-0`}>Doctor of Physical Therapy</p>
          </header>

          <div className="min-w-0 lg:col-span-5 xl:col-span-6">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl bg-forest/5 ring-1 ring-forest/[0.06]">
                <Image
                  src="/images/Tommy-opt.jpg"
                  alt="Tommy Wolfe, DPT"
                  width={5568}
                  height={4036}
                  className="w-full h-auto block"
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7 xl:col-span-6 flex flex-col">
            <div className="hidden lg:block">
              <h3 className="cc-heading-md text-darkgreen !mt-0 !mb-1 max-w-[14ch] leading-[1.05]">
                Tommy Wolfe
              </h3>
              <p className={`${credMeta} !m-0`}>
                Doctor of Physical Therapy
              </p>
            </div>
            <div className="text-group text-group--flush max-w-2xl lg:max-w-none lg:mt-8">
              <p>
                Tommy Wolfe, DPT is an integrative physical therapist, trained at
                USC, who blends traditional rehabilitation with a broader
                approach to movement, performance, and long-term health. As a
                former professional squash player, he has had his share of
                injuries and understands the struggle of climbing back up to a
                high performance level. These experiences, as well as his drive
                to surf until he&apos;s 90, fuel his work and curiosity.
              </p>
              <p>
                Over the years Tommy has formed a distinctive style of
                treatment, influenced by mentors both in and out of the
                traditional PT field.
              </p>
              <p>
                Tommy&apos;s focus goes beyond pain relief: it&apos;s about
                creating autonomy, preventing future setbacks and unlocking the
                body&apos;s potential, no matter the sport or skill level.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-[80px] w-screen max-w-[100vw] ml-[calc(50%-50vw)] min-w-0">
        <div className="relative w-full aspect-[21/8] overflow-hidden bg-forest/5">
          <Image
            src="/images/staff-rev.jpg"
            alt="Common Care team with a patient in the clinic"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}

export default function AboutTabs() {
  const baseId = useId().replace(/:/g, "");
  const approachPanelId = `${baseId}-approach-panel`;
  const teamPanelId = `${baseId}-team-panel`;
  const tabApproachId = `${baseId}-tab-approach`;
  const tabTeamId = `${baseId}-tab-team`;
  const [tab, setTab] = useState<AboutTab>("approach");
  const trackRef = useRef<HTMLDivElement>(null);
  const approachBtnRef = useRef<HTMLButtonElement>(null);
  const teamBtnRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);
  const panelStartRef = useRef<HTMLDivElement>(null);
  const tabStickyRef = useRef<HTMLDivElement>(null);
  const scrollAfterTabChangeRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const btn =
      tab === "approach" ? approachBtnRef.current : teamBtnRef.current;
    if (!track || !btn) return;
    const tr = track.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setIndicator({ left: br.left - tr.left, width: br.width });
  }, [tab]);

  useLayoutEffect(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    const track = trackRef.current;
    const ro = track
      ? new ResizeObserver(() => updateIndicator())
      : null;
    if (track && ro) ro.observe(track);
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [updateIndicator]);

  const syncHash = useCallback((next: AboutTab) => {
    const path = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState(
      null,
      "",
      next === "team" ? `${path}#care-team` : path
    );
  }, []);

  const applyAboutUrlHash = useCallback(() => {
    let h = "";
    try {
      h = decodeURIComponent(
        window.location.hash.replace(/^#/, "")
      );
    } catch {
      h = window.location.hash.replace(/^#/, "");
    }
    if (h === "care-team" || h === "team") setTab("team");
    else setTab("approach");

    const shouldScrollTop = h === "" || ABOUT_NAV_HASHES.has(h);
    if (!shouldScrollTop) return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, []);

  useLayoutEffect(() => {
    applyAboutUrlHash();
    window.addEventListener("hashchange", applyAboutUrlHash);
    return () => window.removeEventListener("hashchange", applyAboutUrlHash);
  }, [applyAboutUrlHash]);

  const scrollTabPanelToGutter = useCallback(() => {
    const prefersCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches;
    const instantTabScroll = reduceMotion || prefersCoarse;

    /** Puts `target`’s top edge `gap` px below live-measured header + About sticky tabs (not scrollIntoView — stacked sticky breaks scroll-margin). */
    const scrollTargetTopBelowChrome = (
      target: HTMLElement,
      extraGapPx = 0
    ) => {
      const rect = target.getBoundingClientRect();
      const sticky = tabStickyRef.current;
      const stickyBottom = sticky?.getBoundingClientRect().bottom ?? 0;
      const headerEl = document.querySelector("header");
      const headerBottom = headerEl?.getBoundingClientRect().bottom ?? 0;
      const chromeBottom = Math.max(headerBottom, stickyBottom);
      const gap = TAB_PANEL_BELOW_STICKY_GAP_PX + extraGapPx;
      const gutterPx =
        chromeBottom > 0
          ? chromeBottom + gap
          : TAB_PANEL_TOP_GUTTER_FALLBACK_PX + extraGapPx;
      const nextY = window.scrollY + rect.top - gutterPx;
      window.scrollTo({
        top: Math.max(0, nextY),
        behavior: instantTabScroll ? "auto" : "smooth",
      });
    };

    if (tab === "team") {
      if (prefersCoarse) {
        const mobileLead = document.getElementById("about-team-mobile-lead");
        if (mobileLead && mobileLead.getBoundingClientRect().height > 0) {
          scrollTargetTopBelowChrome(mobileLead, 6);
          return;
        }
      }
      const teamSec = document.getElementById("care-team");
      if (teamSec) {
        scrollTargetTopBelowChrome(teamSec, 0);
        return;
      }
    }

    const el = panelStartRef.current;
    if (!el) return;
    scrollTargetTopBelowChrome(el, 0);
  }, [reduceMotion, tab]);

  const selectTab = useCallback(
    (next: AboutTab) => {
      setTab((prev) => {
        if (prev !== next) {
          scrollAfterTabChangeRef.current = true;
          return next;
        }
        queueMicrotask(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => scrollTabPanelToGutter());
          });
        });
        return prev;
      });
      syncHash(next);
    },
    [syncHash, scrollTabPanelToGutter]
  );

  useLayoutEffect(() => {
    if (!scrollAfterTabChangeRef.current) return;
    scrollAfterTabChangeRef.current = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollTabPanelToGutter();
        if (tab === "team") {
          requestAnimationFrame(() => {
            scrollTabPanelToGutter();
          });
        }
      });
    });
  }, [tab, scrollTabPanelToGutter]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setTab((t) => {
      const next =
        e.key === "ArrowLeft"
          ? t === "team"
            ? "approach"
            : t
          : t === "approach"
            ? "team"
            : t;
      queueMicrotask(() => {
        const path = `${window.location.pathname}${window.location.search}`;
        window.history.replaceState(
          null,
          "",
          next === "team" ? `${path}#care-team` : path
        );
      });
      return next;
    });
  }, []);

  return (
    <div className="w-full px-6 md:px-16">
      <div className="mx-auto max-w-[1400px] pt-8 md:pt-10">
        <h1 className="sr-only">About Common Care</h1>

        <div className="min-w-0 max-w-3xl">
          <p className="cc-eyebrow text-darkgreen mb-4">About</p>

          <h2 className="cc-heading-sm max-w-4xl">
            We exist to make care feel personal again—where every person is
            deeply understood, supported, and cared for.
          </h2>
        </div>

        <div
          ref={tabStickyRef}
          className="sticky top-14 z-40 mt-10 md:mt-24 w-screen max-w-[100vw] shrink-0 bg-background ml-[calc(50%-50vw)] pt-4 -mt-px sm:top-[60px] md:top-[4.5rem] lg:top-20"
        >
          <div ref={trackRef} className="relative border-b border-forest/12">
            <span
              className="pointer-events-none absolute z-10 h-[2px] bg-marigold bottom-[-1px]"
              style={{
                left: indicator.left,
                width: indicator.width,
                transition: reduceMotion
                  ? "none"
                  : "left 420ms cubic-bezier(0.22, 1, 0.36, 1), width 420ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              aria-hidden
            />
            <div className="px-6 md:px-16">
              <div className="mx-auto max-w-[1400px]">
                <div className="min-w-0 max-w-3xl">
                  <div
                    role="tablist"
                    aria-label="About sections"
                    onKeyDown={onKeyDown}
                    className="flex flex-wrap gap-x-10 gap-y-2"
                  >
                    {TABS.map(({ id, label }) => {
                      const selected = tab === id;
                      const tid = id === "approach" ? tabApproachId : tabTeamId;
                      const ref =
                        id === "approach" ? approachBtnRef : teamBtnRef;
                      return (
                        <button
                          key={id}
                          ref={ref}
                          type="button"
                          role="tab"
                          id={tid}
                          aria-selected={selected}
                          aria-controls={
                            id === "approach" ? approachPanelId : teamPanelId
                          }
                          tabIndex={selected ? 0 : -1}
                          onClick={() => selectTab(id)}
                          className={`pb-3 text-left text-[15px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha/40 ${
                            selected
                              ? "text-darkgreen"
                              : "text-forest/40 hover:text-forest/65"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={panelStartRef} className="mt-10 md:mt-[80px]">
          {tab === "approach" ? (
            <ApproachPanel
              id={approachPanelId}
              labelledBy={tabApproachId}
            />
          ) : (
            <CareTeamPanel id={teamPanelId} labelledBy={tabTeamId} />
          )}
        </div>
      </div>
    </div>
  );
}
