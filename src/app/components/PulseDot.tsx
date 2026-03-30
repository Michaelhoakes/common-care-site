"use client";

type PulseDotColor = "matcha" | "marigold";
type PulseDotSize = "sm" | "md";

const sizeClasses = {
  sm: "w-[7px] h-[7px]", // slightly above 6px — service row accent
  md: "w-2 h-2", // 8px
};

const haloSizeClasses = {
  sm: "w-[13px] h-[13px]", // scaled with 7px dot
  md: "w-4 h-4", // 16px halo for 8px dot
};

const colorClasses = {
  matcha: "bg-matcha",
  marigold: "bg-marigold",
};

interface PulseDotProps {
  /** Brand color for dot and halo */
  color?: PulseDotColor;
  /** Dot diameter: sm ≈7px, md = 8px */
  size?: PulseDotSize;
  /** Additional class names for the wrapper */
  className?: string;
}

/**
 * A subtle, elegant pulsing dot — opacity-only animation with a soft glow halo.
 * Refined and calm; respects prefers-reduced-motion.
 *
 * @example
 * // Inline next to text (e.g. sidebar item)
 * <button className="flex items-center gap-2">
 *   <PulseDot color="marigold" size="sm" />
 *   <span>Care approach</span>
 * </button>
 *
 * @example
 * // Matcha dot, default 8px size
 * <p className="flex items-center gap-2">
 *   <PulseDot color="matcha" /> New or updated
 * </p>
 */
export default function PulseDot({
  color = "matcha",
  size = "md",
  className = "",
}: PulseDotProps) {
  const dotSize = sizeClasses[size];
  const haloSize = haloSizeClasses[size];

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      aria-hidden
    >
      {/* Soft glow halo — opacity animated via keyframes */}
      <span
        className={`absolute rounded-full ${haloSize} ${colorClasses[color]} blur-[3px] pulse-dot-halo-animate md:blur-[4px]`}
      />
      {/* Dot */}
      <span
        className={`relative rounded-full ${dotSize} ${colorClasses[color]} pulse-dot-animate`}
      />
    </span>
  );
}
