"use client";

import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { RelationshipId } from "../config/verificationFormConfig";

type Option = { id: RelationshipId; label: string };

/** Matches InsurerCombobox input focus + default border */
const triggerClass =
  "w-full rounded-lg border border-forest/12 bg-white px-3.5 py-2.5 text-left text-[14px] text-forest shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition-[border-color,box-shadow] focus:outline-none focus:ring-0 focus:border-darkgreen focus:outline focus:outline-[2px] focus:outline-darkgreen focus:outline-offset-[-1px]";

/** Matches InsurerCombobox option rows */
const optionBtnClass =
  "flex w-full min-h-[2.75rem] items-center px-4 py-2.5 text-left text-[14px] leading-snug text-forest/90 hover:bg-bone/80 focus:bg-bone/80 focus:outline-none";

const listSurfaceClass =
  "overflow-auto rounded-lg border border-forest/10 bg-white py-1 shadow-[0_8px_30px_rgba(31,52,20,0.12)] [&>li]:!mb-0 [&>li+li]:!mb-0";

const LIST_MAX_PX = 208; /* max-h-52 */
const GAP_PX = 4;

type Coords = { top: number; left: number; width: number; maxHeight: number };

type RelationshipDropdownProps = {
  id: string;
  value: RelationshipId;
  options: readonly Option[];
  onChange: (id: RelationshipId) => void;
};

export function RelationshipDropdown({
  id,
  value,
  options,
  onChange,
}: RelationshipDropdownProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const selected = options.find((o) => o.id === value);

  const recomputeCoords = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - GAP_PX - 12;
    setCoords({
      top: rect.bottom + GAP_PX,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(120, Math.min(LIST_MAX_PX, spaceBelow)),
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    recomputeCoords();
  }, [open, recomputeCoords]);

  useEffect(() => {
    if (!open) return;
    recomputeCoords();
    window.addEventListener("scroll", recomputeCoords, true);
    window.addEventListener("resize", recomputeCoords);
    return () => {
      window.removeEventListener("scroll", recomputeCoords, true);
      window.removeEventListener("resize", recomputeCoords);
    };
  }, [open, recomputeCoords]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const choose = (next: RelationshipId) => {
    onChange(next);
    setOpen(false);
    btnRef.current?.focus();
  };

  const listPanel =
    open && coords ? (
      <ul
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label="Relationship to policyholder"
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          width: coords.width,
          maxHeight: coords.maxHeight,
          zIndex: 50,
        }}
        className={listSurfaceClass}
      >
        {options.map((o) => {
          const isSel = o.id === value;
          return (
            <li key={o.id} role="option" aria-selected={isSel}>
              <button
                type="button"
                className={optionBtnClass}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o.id)}
              >
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div ref={wrapRef}>
      <div className="relative">
        <button
          ref={btnRef}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          className={`${triggerClass} flex items-center justify-between gap-2 pr-10`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="min-w-0 truncate">{selected?.label ?? "Choose…"}</span>
        </button>
        <ChevronUpDownIcon
          className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/30"
          aria-hidden
        />
      </div>
      {typeof document !== "undefined" && listPanel
        ? createPortal(listPanel, document.body)
        : null}
    </div>
  );
}
