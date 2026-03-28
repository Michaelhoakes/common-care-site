"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type AboutTab = "approach" | "team";

const TABS: { id: AboutTab; label: string }[] = [
  { id: "approach", label: "Who we are" },
  { id: "team", label: "Your care team" },
];

/** Space from viewport top to tab panel when a tab is chosen (header + sticky subnav + ~40px lift vs former 128px scroll-margin). */
const TAB_PANEL_TOP_GUTTER_PX = 88;

function ApproachPanel({
  id,
  labelledBy,
  onShowCareTeam,
}: {
  id: string;
  labelledBy: string;
  onShowCareTeam: () => void;
}) {
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="outline-none">
      <h2 className="sr-only">Who we are</h2>
      <div className="min-w-0 max-w-3xl">
        <section
          id="what-we-believe"
          className="care-section scroll-mt-28"
          aria-labelledby="about-what-we-believe"
        >
          <h3 id="about-what-we-believe" className="cc-heading-md max-w-5xl">
            What we believe
          </h3>
          <div className="mt-10 flex max-w-2xl flex-col gap-6 md:gap-8">
            <div className="text-group text-group--flush">
              <p className="font-medium">Care should be built around people, not systems.</p>
              <p>
                Too often, care is shaped by constraints—time limits, volume,
                and reimbursement. We believe care should adapt to the
                individual, not the other way around.
              </p>
            </div>
            <div className="text-group text-group--flush">
              <p className="font-medium">Understanding comes before treatment.</p>
              <p>
                Real progress starts with listening. Your story, your history,
                and your goals matter just as much as any test or diagnosis.
              </p>
            </div>
            <div className="text-group text-group--flush">
              <p className="font-medium">Getting better is the standard.</p>
              <p>
                Care shouldn&apos;t just maintain or manage—it should lead
                somewhere. We hold ourselves to the expectation that what we do
                makes a meaningful difference.
              </p>
            </div>
            <div className="text-group text-group--flush">
              <p className="font-medium">Trust is earned through consistency.</p>
              <p>
                We show up prepared, present, and accountable—every session,
                every interaction.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="min-w-0 max-w-3xl">
        <div
          className="mt-20 md:mt-28 pt-12 md:pt-16 border-t border-forest/10"
          aria-hidden
        />

        <section
          id="what-we-value"
          className="care-section scroll-mt-28"
          aria-labelledby="about-what-we-value"
        >
          <h3 id="about-what-we-value" className="cc-heading-md max-w-2xl">
            What we value
          </h3>
          <ul className="mt-10 max-w-2xl space-y-6">
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Time and attention
              </p>
              <p style={{ marginTop: 8 }}>
                You&apos;re never rushed. We give care the time it actually
                requires.
              </p>
            </li>
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Clarity
              </p>
              <p style={{ marginTop: 8 }}>
                You should understand what&apos;s going on in your body and why.
                We explain, not just treat.
              </p>
            </li>
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Ownership
              </p>
              <p style={{ marginTop: 8 }}>
                We take responsibility for outcomes, and we equip you to take
                ownership of your health.
              </p>
            </li>
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Integrity
              </p>
              <p style={{ marginTop: 8 }}>
                We do what&apos;s right for you, not what&apos;s easiest or most
                convenient.
              </p>
            </li>
          </ul>

          <div className="mt-14 flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <button
              type="button"
              onClick={onShowCareTeam}
              className="cc-text-btn text-left"
            >
              Your care team →
            </button>
            <Link
              href="/first-visit"
              className="cc-text-btn"
            >
              First visit →
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-10 md:mt-12 w-full min-w-0 pb-[80px]">
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
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} className="outline-none w-full min-w-0">
      <div className="grid grid-cols-1 gap-24 md:gap-28">
        <section
          id="care-team"
          className="care-section scroll-mt-28 grid grid-cols-1 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-8 lg:gap-16 items-center"
        >
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-forest/5">
            <Image
              src="/images/Michael-opt.jpg"
              alt="Michael Oakes, DPT"
              fill
              className="object-cover object-[50%_60%]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="min-w-0 max-w-2xl self-center">
            <h3 className="cc-heading-xs max-w-xl">
              Michael Oakes, DPT
            </h3>
            <div className="text-group pt-3">
              <p className="mt-3">
                Michael focuses on whole-person physical therapy that balances
                precise assessment with practical follow-through. His sessions
                are unhurried and collaborative, with a strong emphasis on
                helping you understand why symptoms show up and what to do
                between visits so progress continues in real life.
              </p>
              <p>
                He brings a movement-first lens to care: clear testing, clear
                explanation, and plans that are realistic enough to maintain
                over time.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-8 lg:gap-16 items-center">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-forest/5">
            <Image
              src="/images/Tommy-opt.jpg"
              alt="Tommy Wolfe, DPT"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="min-w-0 max-w-2xl self-center">
            <h3 className="cc-heading-xs max-w-xl">
              Tommy Wolfe, DPT
            </h3>
            <div className="text-group pt-3">
              <p className="mt-3">
                Tommy combines hands-on treatment with guided movement to build
                durable confidence in how you move. He values consistency and
                communication, helping patients move from flare-up management to
                steady performance and day-to-day comfort.
              </p>
              <p>
                His approach is structured but adaptable, so each plan can
                evolve with your workload, goals, and recovery pace.
              </p>
            </div>
          </div>
        </section>
      </div>

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

  useEffect(() => {
    const scrollForHash = () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
      let attempts = 0;
      const tryScroll = () => {
        const raw = window.location.hash.replace(/^#/, "");
        if (!raw) return;
        const h = decodeURIComponent(raw);
        if (h === "care-team" || h === "team") {
          const el = document.getElementById("care-team");
          if (el) {
            el.scrollIntoView({ behavior, block: "start" });
            return;
          }
        } else if (
          h === "long-horizon" ||
          h === "what-guides-us" ||
          h === "what-we-believe" ||
          h === "what-we-value"
        ) {
          const targetId =
            h === "what-guides-us" || h === "what-we-value"
              ? "what-we-value"
              : "what-we-believe";
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior, block: "start" });
            return;
          }
        } else {
          return;
        }
        if (attempts++ < 24) requestAnimationFrame(tryScroll);
      };
      requestAnimationFrame(tryScroll);
    };

    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "care-team" || h === "team") setTab("team");
      else setTab("approach");
      scrollForHash();
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const scrollTabPanelToGutter = useCallback(() => {
    const el = panelStartRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nextY = window.scrollY + rect.top - TAB_PANEL_TOP_GUTTER_PX;
    window.scrollTo({
      top: Math.max(0, nextY),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  const selectTab = useCallback(
    (next: AboutTab) => {
      setTab((prev) => {
        if (prev !== next) {
          scrollAfterTabChangeRef.current = true;
          return next;
        }
        queueMicrotask(() => {
          requestAnimationFrame(() => scrollTabPanelToGutter());
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
    scrollTabPanelToGutter();
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
          className="sticky top-14 z-40 mt-20 md:mt-24 w-screen max-w-[100vw] shrink-0 bg-background ml-[calc(50%-50vw)] pt-4 -mt-px sm:top-[60px] md:top-[4.5rem] lg:top-20"
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

        <div ref={panelStartRef} className="mt-[80px]">
          {tab === "approach" ? (
            <ApproachPanel
              id={approachPanelId}
              labelledBy={tabApproachId}
              onShowCareTeam={() => selectTab("team")}
            />
          ) : (
            <CareTeamPanel id={teamPanelId} labelledBy={tabTeamId} />
          )}
        </div>
      </div>
    </div>
  );
}
