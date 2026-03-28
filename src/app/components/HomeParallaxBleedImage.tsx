"use client";

import { useRef } from "react";
import {
  useEditorialImageParallax,
  type EditorialParallaxOptions,
} from "../hooks/useEditorialImageParallax";

type Props = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imgClassName?: string;
  /** Oversized parallax layer; smaller inset = slightly “zoomed out” vs default */
  motionInsetClassName?: string;
  options?: EditorialParallaxOptions;
};

export default function HomeParallaxBleedImage({
  src,
  alt,
  wrapperClassName = "",
  imgClassName = "",
  motionInsetClassName = "-inset-[14%]",
  options,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);

  useEditorialImageParallax(wrapRef, motionRef, options);

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden ${wrapperClassName}`.trim()}
    >
      {/* Oversized motion layer so translate/scale never reveals the page beneath */}
      <div
        ref={motionRef}
        className={`absolute min-h-0 min-w-0 ${motionInsetClassName}`.trim()}
      >
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${imgClassName}`.trim()}
        />
      </div>
    </div>
  );
}
