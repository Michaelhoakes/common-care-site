"use client";

import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Insurer } from "../config/verificationFormConfig";
import { INPUT_INVALID_CLASS } from "../lib/formFieldStyles";

type InsurerComboboxProps = {
  id: string;
  insurers: readonly Insurer[];
  value: string;
  onChange: (insurerId: string, label: string) => void;
  error?: string;
  hint?: string;
  invalid?: boolean;
};

const inputClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14px] text-forest placeholder:text-forest/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] focus:outline-none focus:ring-0 focus:border-darkgreen focus:outline focus:outline-[2px] focus:outline-darkgreen focus:outline-offset-[-1px]";

const optionBtnClass =
  "flex w-full min-h-[2.75rem] items-center px-4 py-2.5 text-left text-[14px] leading-snug text-forest/90 hover:bg-bone/80 focus:bg-bone/80 focus:outline-none";

export function InsurerCombobox({
  id,
  insurers,
  value,
  onChange,
  error,
  hint,
  invalid,
}: InsurerComboboxProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = useMemo(
    () => insurers.find((i) => i.id === value),
    [insurers, value]
  );

  const display = open ? query : selected?.label ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...insurers];
    return insurers.filter((i) => i.label.toLowerCase().includes(q));
  }, [insurers, query]);

  const describedBy =
    [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") ||
    undefined;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const choose = useCallback(
    (i: Insurer) => {
      onChange(i.id, i.label);
      setQuery("");
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange]
  );

  return (
    <div ref={wrapRef}>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={`${inputClass} pr-10 ${invalid ? INPUT_INVALID_CLASS : "border-forest/12"}`}
          placeholder="Search insurance carrier…"
          value={display}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value && e.target.value !== selected?.label) {
              onChange("", "");
            }
          }}
          onFocus={() => {
            setOpen(true);
            if (selected) setQuery(selected.label);
          }}
          onBlur={() => {
            requestAnimationFrame(() => {
              if (!wrapRef.current?.matches(":focus-within")) {
                setOpen(false);
                setQuery("");
              }
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              setQuery("");
            }
          }}
        />
        <ChevronUpDownIcon
          className="pointer-events-none absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-forest/30"
          aria-hidden
        />
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-0.5 max-h-52 overflow-auto rounded-lg border border-forest/10 bg-white py-1 shadow-[0_8px_30px_rgba(31,52,20,0.12)] [&>li]:!mb-0 [&>li+li]:!mb-0"
          >
            {filtered.length === 0 ? (
              <li
                className="flex min-h-[2.75rem] items-center px-4 py-2.5 text-[14px] leading-snug text-forest/80"
                role="presentation"
              >
                No match—try another spelling or choose{" "}
                <button
                  type="button"
                  className="font-medium text-matcha underline-offset-2 hover:underline"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    choose({ id: "other", label: "Other / not listed" })
                  }
                >
                  Other / not listed
                </button>
                .
              </li>
            ) : (
              filtered.map((i) => (
                <li key={i.id} role="option" aria-selected={i.id === value}>
                  <button
                    type="button"
                    className={optionBtnClass}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(i)}
                  >
                    {i.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {hint && (
        <p
          id={`${id}-hint`}
          className="!mt-[4px] !mb-0 text-[14px] text-forest/80"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-err`}
          className="!mt-[8px] !mb-0 text-[13px] !leading-[normal] text-red-700/90"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
