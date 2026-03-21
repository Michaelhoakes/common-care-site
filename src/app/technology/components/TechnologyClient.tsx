"use client";

import { useState, useEffect } from "react";

type Technology = {
  id: string;
  name: string;
  descriptor: string;
  measures: string;
  whyItMatters: string;
};

const TECHNOLOGIES: Technology[] = [
  {
    id: "motion-capture",
    name: "Motion capture",
    descriptor: "Movement patterning in 3D",
    measures:
      "We capture how you move through space — joint angles, timing, and symmetry — so we can see patterns that aren’t obvious to the eye alone.",
    whyItMatters:
      "Understanding how you actually move helps us tailor exercises and cues to your body, not a textbook. It also gives us a clear before-and-after so progress is visible.",
  },
  {
    id: "force-plates",
    name: "Force plate analysis",
    descriptor: "How you load and balance",
    measures:
      "Force plates measure how weight and pressure distribute through your feet during standing, walking, or specific tasks — balance, asymmetry, and load shifting over time.",
    whyItMatters:
      "How you load your body affects everything from recovery to everyday comfort. We use this to guide balance work, gait retraining, and load management.",
  },
  {
    id: "surface-emg",
    name: "Surface EMG",
    descriptor: "Muscle activation and symmetry",
    measures:
      "Surface EMG tracks muscle activity in real time — which muscles fire, when, and how evenly — without needles or invasive equipment.",
    whyItMatters:
      "Seeing which muscles are working (or not) helps us correct imbalances, reduce overuse, and build more efficient movement patterns.",
  },
  {
    id: "posture-assessment",
    name: "Posture assessment",
    descriptor: "Alignment and habits",
    measures:
      "We assess resting and active posture — how you hold yourself at a desk, on your feet, or in motion — to link posture to how you feel and perform.",
    whyItMatters:
      "Posture isn’t about looking a certain way; it’s about how your body is loaded day to day. We use this to target habits and positions that drive pain or fatigue.",
  },
];

export default function TechnologyClient() {
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = openId ? TECHNOLOGIES.find((t) => t.id === openId) : null;

  useEffect(() => {
    if (openId) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    if (openId) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [openId]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {TECHNOLOGIES.map((tech) => (
          <button
            key={tech.id}
            type="button"
            onClick={() => setOpenId(tech.id)}
            className="technology-tile group text-left w-full rounded-lg border border-forest/15 bg-white/60 backdrop-blur-sm p-6 md:p-8 transition-all duration-300 ease-out hover:border-forest/25 hover:bg-white/90 hover:shadow-[0_4px_24px_rgba(31,52,20,0.06)] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2"
          >
            <h3 className="font-hero-display text-xl md:text-2xl text-darkgreen font-medium tracking-normal">
              {tech.name}
            </h3>
            <p className="mt-2 text-forest/80 text-[15px] leading-relaxed">
              {tech.descriptor}
            </p>
          </button>
        ))}
      </div>

      {/* Overlay */}
      <div
        aria-hidden
        className={`fixed inset-0 z-40 bg-darkgreen/20 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          openId ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenId(null)}
      />

      {/* Side sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="technology-sheet-heading"
        aria-label="Technology detail"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[480px] md:max-w-[520px] bg-bone border-l border-forest/10 shadow-[-8px_0_32px_rgba(31,52,20,0.08)] flex flex-col transition-transform duration-300 ease-out ${
          openId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selected && (
          <>
            <div className="flex-1 overflow-y-auto px-16 py-10 md:py-12">
              <h2
                id="technology-sheet-heading"
                className="font-hero-display text-3xl md:text-4xl text-darkgreen font-medium tracking-normal"
              >
                {selected.name}
              </h2>
              <p className="mt-2 text-forest/70 text-sm font-medium tracking-wide">
                {selected.descriptor}
              </p>

              <div className="mt-10">
                <h4 className="text-xs font-mono font-medium tracking-widest uppercase text-forest/60 mb-2">
                  What it measures
                </h4>
                <p className="text-forest/90 text-[17px] leading-[1.65]">
                  {selected.measures}
                </p>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-mono font-medium tracking-widest uppercase text-forest/60 mb-2">
                  Why it matters for care
                </h4>
                <p className="text-forest/90 text-[17px] leading-[1.65]">
                  {selected.whyItMatters}
                </p>
              </div>

              <div className="mt-10">
                <div
                  className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-pistachio/20 via-dusty-blue/15 to-matcha/10 border border-forest/10"
                  aria-hidden
                />
                <p className="mt-3 text-xs text-forest/50 font-mono">
                  Visual placeholder
                </p>
              </div>
            </div>

            <div className="shrink-0 px-16 py-6 border-t border-forest/10">
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="text-forest/80 text-sm font-medium hover:text-forest transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
