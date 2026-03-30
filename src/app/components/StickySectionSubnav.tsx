"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePrefersReducedMotion } from "../care/hooks/useCareSidebarProgress";

type Section = { id: string; label: string };

export default function StickySectionSubnav({
  sections,
  activeId,
  onSelect,
  ariaLabel = "On this page",
}: {
  sections: readonly Section[];
  activeId: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const btn = btnRefs.current.get(activeId);
    if (!track || !btn) return;
    const tr = track.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setIndicator({ left: br.left - tr.left, width: br.width });
  }, [activeId]);

  useLayoutEffect(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    const track = trackRef.current;
    const scroller = scrollRef.current;
    const ro = track ? new ResizeObserver(() => updateIndicator()) : null;
    if (track && ro) ro.observe(track);
    if (scroller && ro) ro.observe(scroller);
    const onScroll = () => updateIndicator();
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      scroller?.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    };
  }, [updateIndicator]);

  useLayoutEffect(() => {
    const btn = btnRefs.current.get(activeId);
    if (!btn) return;
    btn.scrollIntoView({ behavior: "auto", inline: "nearest", block: "nearest" });
  }, [activeId]);

  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId)
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const i = activeIndex;
      const next =
        e.key === "ArrowLeft"
          ? Math.max(0, i - 1)
          : Math.min(sections.length - 1, i + 1);
      const id = sections[next]?.id;
      if (id) {
        onSelect(id);
        queueMicrotask(() => btnRefs.current.get(id)?.focus());
      }
    },
    [activeIndex, onSelect, sections]
  );

  return (
    <div
      className="lg:hidden sticky top-14 z-40 mt-20 md:mt-24 w-screen max-w-[100vw] shrink-0 bg-background ml-[calc(50%-50vw)] pt-4 -mt-px sm:top-[60px] md:top-[4.5rem]"
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
          <div className="mx-auto max-w-[1400px] min-w-0">
            <div
              ref={scrollRef}
              className="min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div
                role="tablist"
                aria-label={ariaLabel}
                onKeyDown={onKeyDown}
                className="flex w-max flex-nowrap gap-x-5"
              >
                {sections.map(({ id, label }) => {
                  const selected = activeId === id;
                  return (
                    <button
                      key={id}
                      ref={(el) => {
                        if (el) btnRefs.current.set(id, el);
                        else btnRefs.current.delete(id);
                      }}
                      type="button"
                      role="tab"
                      id={`subnav-tab-${id}`}
                      aria-controls={id}
                      aria-selected={selected}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => onSelect(id)}
                      className={`shrink-0 whitespace-nowrap pb-3 text-left text-[15px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-matcha/40 ${
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
  );
}
