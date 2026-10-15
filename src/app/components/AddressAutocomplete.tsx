"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    google?: any;
  }
}

export type AddressParts = {
  formattedAddress: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

type AddressAutocompleteProps = {
  id: string;
  value: string;
  onChange: (next: { text: string; parts?: AddressParts }) => void;
  placeholder?: string;
  className?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string | undefined;
  disabled?: boolean;
  onBlur?: () => void;
};

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const existing = document.getElementById("google-maps-places-script");
  if (existing) {
    if (window.google?.maps?.places) return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps script"))
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "google-maps-places-script";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&v=weekly`;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Failed to load Google Maps script"))
    );
    document.head.appendChild(script);
  });
}

function parseAddressParts(place: any): AddressParts {
  const components = (place?.address_components ?? []) as Array<{
    types?: string[];
    long_name?: string;
    short_name?: string;
  }>;
  const get = (type: string) =>
    components.find((c) => c.types?.includes(type))?.long_name;
  const getShort = (type: string) =>
    components.find((c) => c.types?.includes(type))?.short_name;

  const streetNumber = get("street_number");
  const route = get("route");

  const city =
    components.find((c) => c.types?.includes("locality"))?.long_name ??
    components.find((c) => c.types?.includes("postal_town"))?.long_name ??
    components.find((c) => c.types?.includes("sublocality_level_1"))?.long_name;

  const state = getShort("administrative_area_level_1");
  const zipCode = get("postal_code") ?? get("postal_code_suffix");

  const formattedAddress = place.formatted_address ?? "";
  const addressLine1 = streetNumber && route ? `${streetNumber} ${route}` : undefined;

  return {
    formattedAddress,
    addressLine1,
    city,
    state,
    zipCode,
  };
}

export function AddressAutocomplete({
  id,
  value,
  onChange,
  placeholder,
  className,
  ariaInvalid,
  ariaDescribedBy,
  disabled,
  onBlur,
}: AddressAutocompleteProps) {
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const hasApiKey = Boolean(apiKey);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);
  const listenerCleanupRef = useRef<(() => void) | null>(null);
  const pacObserverCleanupRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(() => Boolean(apiKey));

  useEffect(() => {
    let cancelled = false;
    if (!apiKey) return;
    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled) return;
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    // If the API key is missing, this component can't provide Google Places suggestions.
    // Native browser autofill may still work because we keep normal address autocomplete tokens.
    if (typeof window === "undefined") return;
    if (!hasApiKey && process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(
        "[AddressAutocomplete] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set — Google address suggestions will be unavailable."
      );
    }
  }, [hasApiKey]);

  useEffect(() => {
    if (!ready) return;
    const el = inputRef.current;
    if (!el) return;
    if (!window.google?.maps?.places) return;

    // Avoid re-initializing on every render.
    if (autocompleteRef.current) return;

    const options: any = {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["address_components", "formatted_address"],
    };

    const ac = new window.google.maps.places.Autocomplete(el, options);
    autocompleteRef.current = ac;

    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place) return;
      const parts = parseAddressParts(place);

      // Prefer a clean street line when we have it; otherwise, fall back to the
      // formatted address so the field always reflects the chosen suggestion.
      const streetLine = parts.addressLine1;
      const formatted = place.formatted_address as string | undefined;
      const nextText =
        streetLine && streetLine.trim().length > 0
          ? streetLine
          : formatted && formatted.trim().length > 0
            ? formatted
            : "";
      onChange({ text: nextText, parts });
    });

    listenerCleanupRef.current = () => {
      window.google?.maps?.event?.removeListener?.(listener);
    };

    return () => {
      listenerCleanupRef.current?.();
      autocompleteRef.current = null;
      listenerCleanupRef.current = null;
    };
    // We intentionally omit `value` so the autocomplete is stable.
  }, [ready, id, onChange]);

  useEffect(() => {
    if (!ready) return;
    if (typeof document === "undefined") return;

    const syncPacContainers = () => {
      const containers = Array.from(
        document.querySelectorAll<HTMLElement>(".pac-container")
      );
      if (containers.length <= 1) return;

      // Prefer the currently visible container; if multiple are visible,
      // choose the newest (last in DOM).
      const visible = containers.filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      const active = (visible.length ? visible : containers).at(-1);
      if (!active) return;

      for (const el of containers) {
        if (el === active) {
          el.dataset.ccPacActive = "true";
          el.style.visibility = "";
          el.style.opacity = "";
          el.style.pointerEvents = "";
          el.style.maxHeight = "";
        } else {
          el.dataset.ccPacActive = "false";
          el.style.visibility = "hidden";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.maxHeight = "0px";
        }
      }
    };

    const obs = new MutationObserver(() => syncPacContainers());
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Initial sync for already-mounted containers.
    syncPacContainers();

    pacObserverCleanupRef.current = () => obs.disconnect();
    return () => {
      pacObserverCleanupRef.current?.();
      pacObserverCleanupRef.current = null;
      const containers = document.querySelectorAll<HTMLElement>(".pac-container");
      containers.forEach((el) => {
        delete el.dataset.ccPacActive;
        el.style.visibility = "";
        el.style.opacity = "";
        el.style.pointerEvents = "";
        el.style.maxHeight = "";
      });
    };
  }, [ready]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      // Use standard autocomplete name tokens so native autofill works when Google isn’t available.
      name={hasApiKey ? "addressLine1" : "street-address"}
      placeholder={placeholder}
      className={`${className} cc-address-input`}
      defaultValue={value}
      onChange={(e) => {
        onChange({ text: e.target.value });
      }}
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      autoComplete={hasApiKey ? "street-address" : "on"}
      onBlur={onBlur}
      spellCheck={false}
    />
  );
}

