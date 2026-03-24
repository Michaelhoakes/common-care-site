"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";

const LINE_DURATION_MS = 2800;
const LINE_DELAY_MS = 200;

/** Scroll distance while the module stays pinned (sticky). */
const PIN_SCROLL_VH = 260;

const STAGES = [
  {
    id: "healing",
    title: "On the path to healing",
    short: "Healing",
    body: "You're navigating injury or chronic pain and need relief and rehabilitation.",
  },
  {
    id: "balance",
    title: "Rebuilding balance",
    short: "Balance",
    body: "You feel imbalanced — dealing with stress, fatigue, bad sleep, or low energy. You want to feel whole again and regain control of your health.",
  },
  {
    id: "longevity",
    title: "Investing in longevity",
    short: "Longevity",
    body: "You feel strong and want to continue investing in your long-term health and longevity.",
  },
] as const;

function scrollProgressInSpacer(spacer: HTMLElement): number {
  const r = spacer.getBoundingClientRect();
  const denom = Math.max(1, r.height - window.innerHeight);
  return Math.min(1, Math.max(0, -r.top / denom));
}

function stageIndexFromProgress(p: number): number {
  return Math.min(
    STAGES.length - 1,
    Math.floor(p * STAGES.length)
  );
}

/** Full-bleed layers: `absolute inset-0` on the same `relative` box as the content. */
function IsForMeModuleBackground() {
  return (
    <>
      <div
        className="absolute inset-0 z-0 min-h-full w-full pointer-events-none bg-pistachio-light"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 100% 80% at 80% 20%, rgba(143, 168, 92, 0.55) 0%, rgba(143, 168, 92, 0.2) 40%, transparent 70%),
            radial-gradient(ellipse 90% 70% at 15% 80%, rgba(91, 121, 68, 0.45) 0%, rgba(143, 168, 92, 0.25) 45%, transparent 70%),
            radial-gradient(ellipse 70% 100% at 50% 50%, rgba(208, 219, 174, 0.5) 0%, rgba(143, 168, 92, 0.15) 50%, transparent 75%),
            linear-gradient(145deg, rgba(208, 219, 174, 0.35) 0%, transparent 35%, rgba(91, 121, 68, 0.2) 100%)
          `,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0 min-h-full w-full pointer-events-none opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />
    </>
  );
}

export default function IsThisForMeSection() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileLabelRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const show = visible || reducedMotion;

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const onScroll = () => {
      hasScrolledRef.current = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!hasScrolledRef.current || !entry.isIntersecting) return;
        const { top } = entry.boundingClientRect;
        const triggerZone = window.innerHeight * 0.85;
        if (top <= triggerZone) setVisible(true);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const tw = track.clientWidth;
    if (tw <= 0) return;

    if (reducedMotion) {
      setIndicator({ left: 0, width: tw });
      return;
    }

    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;

    if (isDesktop) {
      const stageEl = stageRefs.current[activeStage];
      if (!stageEl) return;
      const tr = track.getBoundingClientRect();
      const sr = stageEl.getBoundingClientRect();
      setIndicator({
        left: sr.left - tr.left,
        width: Math.max(0, sr.width),
      });
      return;
    }

    const segW = tw / STAGES.length;
    setIndicator({
      left: activeStage * segW,
      width: Math.max(0, segW),
    });
  }, [activeStage, reducedMotion]);

  useLayoutEffect(() => {
    if (!show) return;
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    const ro = trackRef.current
      ? new ResizeObserver(() => updateIndicator())
      : null;
    if (trackRef.current && ro) ro.observe(trackRef.current);
    return () => {
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [show, updateIndicator]);

  useEffect(() => {
    if (!show || reducedMotion) return;
    const spacer = spacerRef.current;
    if (!spacer) return;

    const sync = () => {
      const p = scrollProgressInSpacer(spacer);
      setActiveStage(stageIndexFromProgress(p));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [show, reducedMotion]);

  const skipMobileLabelScrollRef = useRef(true);

  useEffect(() => {
    if (reducedMotion) return;
    if (skipMobileLabelScrollRef.current) {
      skipMobileLabelScrollRef.current = false;
      return;
    }
    const btn = mobileLabelRefs.current[activeStage];
    if (!btn) return;
    btn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeStage, reducedMotion]);

  const scrollToStage = (idx: number) => {
    if (reducedMotion) {
      const el = stageRefs.current[idx];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const spacer = spacerRef.current;
    if (!spacer) return;
    const r = spacer.getBoundingClientRect();
    const spacerTop = r.top + window.scrollY;
    const scrollRange = Math.max(0, spacer.offsetHeight - window.innerHeight);
    const t = (idx + 0.45) / STAGES.length;
    window.scrollTo({
      top: spacerTop + t * scrollRange,
      behavior: "smooth",
    });
  };

  const indicatorTransition = reducedMotion
    ? "none"
    : "left 380ms cubic-bezier(0.22, 1, 0.36, 1), width 380ms cubic-bezier(0.22, 1, 0.36, 1)";

  const moduleContent = (
    <div className="relative z-10 w-full px-6 md:px-16 flex flex-col gap-4">
        <p
          className={`text-sm font-mono font-medium tracking-widest uppercase ${
            show ? "opacity-60 translate-y-0" : "opacity-0 translate-y-[10px]"
          } ${!reducedMotion ? "transition-all duration-[1100ms] ease-out" : ""}`}
        >
          Is this for me?
        </p>
        <h4
          className={`max-w-2xl mb-0 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[12px]"
          } ${!reducedMotion ? "transition-all duration-[1100ms] ease-out" : ""}`}
          style={
            !reducedMotion ? { transitionDelay: visible ? "200ms" : "0ms" } : undefined
          }
        >
          Wherever you are, we meet you there.
        </h4>

        <div className="pt-14 md:pt-16 relative mt-3 md:mt-4">
          <div
            className={`-ml-6 md:-ml-16 relative ${
              show
                ? "w-[calc(100%+1.5rem)] md:w-[calc(100%+128px)]"
                : "w-0"
            } ${!reducedMotion ? "transition-[width] ease-out" : ""}`}
            style={
              !reducedMotion
                ? {
                    transitionDuration: `${LINE_DURATION_MS}ms`,
                    transitionDelay: visible ? `${LINE_DELAY_MS}ms` : "0ms",
                  }
                : undefined
            }
          >
            <div
              className="md:hidden flex gap-2 overflow-x-auto mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mr-2 pr-2"
              role="tablist"
              aria-label="Stages"
            >
              {STAGES.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    mobileLabelRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={activeStage === i}
                  onClick={() => scrollToStage(i)}
                  className={`snap-center shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                    activeStage === i
                      ? "text-darkgreen bg-white/35"
                      : "text-forest/45"
                  }`}
                >
                  {item.short}
                </button>
              ))}
            </div>

            <div ref={trackRef} className="relative min-h-px">
              <div
                className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-darkgreen/45"
                aria-hidden
              />
              <div className="relative border-b border-forest/12">
                <span
                  className="pointer-events-none absolute z-10 h-[2px] bg-darkgreen bottom-[-1px]"
                  style={{
                    left: indicator.left,
                    width: indicator.width,
                    transition: indicatorTransition,
                  }}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-4 md:pt-4">
            {STAGES.map((item, i) => {
              const active = reducedMotion || activeStage === i;
              return (
                <div
                  key={item.id}
                  id={`is-for-me-stage-${i}`}
                  ref={(el) => {
                    stageRefs.current[i] = el;
                  }}
                  className="relative scroll-mt-32 md:scroll-mt-40"
                >
                  <div
                    className={`${
                      show
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-[10px]"
                    } ${!reducedMotion ? "transition-all duration-[1100ms] ease-out" : ""} flex flex-col gap-0`}
                    style={
                      !reducedMotion && visible
                        ? { transitionDelay: `${200 + 200 * i}ms` }
                        : undefined
                    }
                  >
                    <h5
                      className={`m-0 leading-snug transition-colors duration-300 ${
                        active ? "text-darkgreen" : "text-forest/42"
                      }`}
                    >
                      {item.title}
                    </h5>
                    <p
                      className={`m-0 !mt-2 text-pretty transition-colors duration-300 ${
                        active ? "text-forest/88" : "text-forest/48"
                      }`}
                      style={{ marginBottom: 0 }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );

  return (
    <section
      id="is-this-for-me"
      ref={sectionRef}
      className="relative"
    >
      {reducedMotion ? (
        <div className="relative min-h-0 overflow-hidden py-[120px]">
          <IsForMeModuleBackground />
          {moduleContent}
        </div>
      ) : (
        <div
          ref={spacerRef}
          className="relative"
          style={{ minHeight: `${PIN_SCROLL_VH}vh` }}
        >
          <div className="sticky top-0 z-30 relative overflow-hidden">
            <IsForMeModuleBackground />
            <div className="relative z-10 w-full py-[120px]">
              {moduleContent}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
