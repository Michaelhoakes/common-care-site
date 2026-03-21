"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";

const LOTTIE_SIZE = 32;

type GreenDotLottieProps = {
  active: boolean;
  visible: boolean;
  reducedMotion: boolean;
  className?: string;
};

export default function GreenDotLottie({
  active,
  visible,
  reducedMotion,
  className = "",
}: GreenDotLottieProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/animations/green-dot-pulse.json")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (reducedMotion) {
    return (
      <span
        className={`inline-block rounded-full bg-matcha ${className}`}
        style={{
          width: 8,
          height: 8,
          opacity: visible ? 1 : 0,
        }}
        aria-hidden
      />
    );
  }

  if (active && animationData) {
    return (
      <span
        className={`absolute left-0 top-[-35.5px] flex items-center justify-center overflow-visible ${className}`}
        style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE, marginLeft: -((LOTTIE_SIZE - 8) / 2) }}
        aria-hidden
      >
        <Lottie
          animationData={animationData}
          loop={false}
          style={{ width: LOTTIE_SIZE, height: LOTTIE_SIZE }}
        />
      </span>
    );
  }

  return (
    <span
      className={`absolute left-0 top-[-35.5px] w-2 h-2 rounded-full bg-matcha transition-opacity duration-300 ease-out ${className}`}
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    />
  );
}
