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
  { id: "approach", label: "Common approach" },
  { id: "team", label: "Your care team" },
];

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
      <div className="min-w-0 max-w-3xl">
        <section
          id="long-horizon"
          className="care-section scroll-mt-28"
          aria-labelledby="about-long-horizon"
        >
          <h3 id="about-long-horizon" className="max-w-5xl">
            Long-horizon care
          </h3>
          <p className="mt-8 max-w-2xl">
            Lasting outcomes rarely come from rushed appointments or one-size
            templates. We take time to understand how you move, recover, and
            carry stress—then build a picture that can grow with you, visit
            after visit.
          </p>
          <p className="mt-6 max-w-2xl">
            That means honest expectations, follow-through, and room to adjust
            as life changes. The goal isn’t a perfect week on paper; it&apos;s
            steady progress you can recognize and keep.
          </p>
        </section>
      </div>

      <div className="mt-10 md:mt-12 w-full min-w-0">
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-forest/5">
          <Image
            src="/images/clinic1.jpg"
            alt="Common Care clinic interior"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1400px"
          />
        </div>
      </div>

      <div className="min-w-0 max-w-3xl pb-[80px]">
        <div
          className="mt-20 md:mt-28 pt-12 md:pt-16 border-t border-forest/10"
          aria-hidden
        />

        <section
          id="what-guides-us"
          className="care-section scroll-mt-28"
          aria-labelledby="about-priorities"
        >
          <h3 id="about-priorities" className="max-w-2xl">
            Discover our key priorities
          </h3>
          <ul className="mt-10 max-w-2xl space-y-6">
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Whole-person context
              </p>
              <p style={{ marginTop: 8 }}>
                Movement, stress, sleep, and daily load all shape how you feel.
                We listen for the full picture.
              </p>
            </li>
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Evidence-informed practice
              </p>
              <p style={{ marginTop: 8 }}>
                We combine clinical experience with what research supports
                —without jargon or performance theater.
              </p>
            </li>
            <li>
              <p className="font-medium" style={{ marginBottom: 0 }}>
                Time and dignity
              </p>
              <p style={{ marginTop: 8 }}>
                Unhurried sessions, clear explanations, and respect for your
                goals—not ours.
              </p>
            </li>
          </ul>

          <div className="mt-14 flex flex-col sm:flex-row sm:flex-wrap gap-4">
            <button
              type="button"
              onClick={onShowCareTeam}
              className="care-link text-left font-medium border-b border-forest/30 hover:border-forest transition-colors"
            >
              Your care team →
            </button>
            <Link
              href="/first-visit"
              className="care-link font-medium border-b border-forest/30 hover:border-forest transition-colors"
            >
              First visit →
            </Link>
          </div>
        </section>

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
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-8 lg:gap-16 items-center">
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-forest/5">
            <Image
              src="/images/Michael.jpg"
              alt="Michael Oakes, DPT"
              fill
              className="object-cover object-[50%_60%]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="min-w-0 max-w-2xl self-center">
            <h5 className="max-w-xl" style={{ fontWeight: 600 }}>
              Michael Oakes, DPT
            </h5>
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
              src="/images/Tommy.jpg"
              alt="Tommy Wolfe, DPT"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="min-w-0 max-w-2xl self-center">
            <h5 className="max-w-xl" style={{ fontWeight: 600 }}>
              Tommy Wolfe, DPT
            </h5>
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
    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "care-team" || h === "team") setTab("team");
      else setTab("approach");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const selectTab = useCallback((next: AboutTab) => {
    setTab(next);
    syncHash(next);
    panelStartRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reduceMotion, syncHash]);

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

          <h4 className="max-w-4xl">
            Care should never feel generic. We take a deeply personal approach,
            delivered by a team that&apos;s committed to understanding you and
            helping you get better.
          </h4>
        </div>

        <div
          className="sticky top-20 z-40 mt-20 md:mt-24 w-screen max-w-[100vw] shrink-0 bg-background ml-[calc(50%-50vw)] pt-4 -mt-px"
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

        <div ref={panelStartRef} className="mt-[80px] scroll-mt-32">
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
