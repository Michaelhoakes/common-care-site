"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type FieldTooltipProps = {
  /** Short label for assistive tech, e.g. "Member ID" */
  fieldLabel: string;
  lines: readonly string[];
  /** Optional insurer-specific line (appended below base lines) */
  extraHint?: string;
  /** Override panel width (Tailwind classes); default ~18rem max */
  panelClassName?: string;
};

/**
 * Info icon with tooltip: hover/focus on desktop, tap to toggle on coarse pointers.
 */
export function FieldTooltip({
  fieldLabel,
  lines,
  extraHint,
  panelClassName,
}: FieldTooltipProps) {
  const tooltipId = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [allowHover, setAllowHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setAllowHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || allowHover) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc, true);
    return () => document.removeEventListener("mousedown", onDoc, true);
  }, [open, allowHover, close]);

  const allLines = extraHint ? [...lines, extraHint] : [...lines];

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex align-middle"
      onPointerEnter={() => allowHover && setOpen(true)}
      onPointerLeave={() => allowHover && setOpen(false)}
    >
      <button
        ref={btnRef}
        type="button"
        className="-m-1 rounded-md p-1 text-forest/70 transition-colors hover:text-matcha focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha/40 focus-visible:ring-offset-1"
        aria-label={`Help: ${fieldLabel}`}
        aria-expanded={open}
        aria-controls={tooltipId}
        onPointerDown={(e) => {
          if (!allowHover) {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!allowHover) return;
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
      >
        <InformationCircleIcon className="h-[1.125rem] w-[1.125rem]" aria-hidden />
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-lg border border-forest/10 bg-white px-3.5 py-2.5 text-left text-[13px] font-normal font-sans leading-snug text-forest/85 shadow-[0_8px_30px_rgba(31,52,20,0.12)] md:left-0 md:translate-x-0 ${
            panelClassName ?? "w-[min(18rem,calc(100vw-2rem))]"
          }`}
        >
          {allLines.map((line, i) => (
            <span key={i} className={i > 0 ? "mt-1.5 block" : "block"}>
              {line}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}
