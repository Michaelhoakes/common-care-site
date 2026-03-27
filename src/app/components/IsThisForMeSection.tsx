"use client";

import { useState, useRef, useEffect } from "react";

const STAGES = [
  {
    id: "healing",
    title: "On the path to healing",
    body: "You're navigating injury or chronic pain and need relief and rehabilitation.",
  },
  {
    id: "balance",
    title: "Rebuilding balance",
    body: "You feel imbalanced — dealing with stress, fatigue, bad sleep, or low energy. You want to feel whole again and regain control of your health.",
  },
  {
    id: "longevity",
    title: "Investing in longevity",
    body: "You feel strong and want to continue investing in your long-term health.",
  },
] as const;

const STAGGER = {
  eyebrow: 0,
  heading: 90,
  rule: 200,
  colBase: 360,
  colStep: 160,
} as const;

/** Full-bleed photo: `absolute inset-0` on the same `relative` box as the content. */
function IsForMeModuleBackground() {
  return (
    <picture className="absolute inset-0 z-0 min-h-full w-full pointer-events-none">
      <source media="(max-width: 767px)" srcSet="/images/Isthisforme-m.jpg" />
      <img
        src="/images/Isthisforme-d.jpg"
        alt=""
        className="h-full min-h-full w-full object-cover"
        aria-hidden
      />
    </picture>
  );
}

export default function IsThisForMeSection() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const motionCls = reducedMotion
    ? ""
    : "transition-all duration-[850ms] ease-out";

  return (
    <section
      id="is-this-for-me"
      ref={sectionRef}
      className="relative overflow-x-clip"
    >
      <div className="relative min-h-0 overflow-x-clip py-10 md:py-14 lg:py-20">
        <IsForMeModuleBackground />
        <div className="relative z-10 w-full px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1400px] flex flex-col gap-4">
            <p
              className={`text-sm font-mono font-medium tracking-widest uppercase text-white/85 ${motionCls} ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[10px]"
              }`}
              style={
                !reducedMotion ? { transitionDelay: `${STAGGER.eyebrow}ms` } : undefined
              }
            >
              Is this for me?
            </p>
            <h2
              className={`cc-heading-sm max-w-2xl mb-0 text-white ${motionCls} ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-[12px]"
              }`}
              style={
                !reducedMotion ? { transitionDelay: `${STAGGER.heading}ms` } : undefined
              }
            >
              Wherever you are, we meet you there.
            </h2>

            <div className="pt-14 md:pt-16 relative mt-3 md:mt-4">
              <div
                className="relative hidden md:block w-screen max-w-[100vw] shrink-0 pb-5 md:pb-6"
                style={{
                  marginLeft: "calc(50% - 50vw)",
                  marginRight: "calc(50% - 50vw)",
                }}
              >
                <div
                  className={`w-full border-b border-white/25 ${motionCls} ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                  style={
                    !reducedMotion ? { transitionDelay: `${STAGGER.rule}ms` } : undefined
                  }
                  aria-hidden
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pt-4 md:pt-4">
                {STAGES.map((item, i) => {
                  const colDelay = STAGGER.colBase + STAGGER.colStep * i;
                  return (
                    <div
                      key={item.id}
                      id={`is-for-me-stage-${i}`}
                      className="relative scroll-mt-32 md:scroll-mt-40"
                    >
                      <div
                        className={`flex flex-col gap-0 ${motionCls} ${
                          visible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-[10px]"
                        }`}
                        style={
                          !reducedMotion
                            ? { transitionDelay: `${colDelay}ms` }
                            : undefined
                        }
                      >
                        <h3 className="cc-heading-xs m-0 max-w-xl leading-snug text-white">
                          {item.title}
                        </h3>
                        <div className="text-group pt-3">
                          <p className="mt-3 max-w-md text-white/92">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
