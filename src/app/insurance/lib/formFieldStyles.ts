/**
 * Appended to `inputClass` when a field is invalid. Must win over
 * `focus:border-darkgreen` / `focus:outline-darkgreen` (submit focuses first error).
 */
export const INPUT_INVALID_CLASS =
  "!border-red-400/80 focus:!border-red-400/80 focus-visible:!border-red-400/80 focus:!outline-red-400/70 focus-visible:!outline-red-400/70";

/** `type="date"` has a large intrinsic min-width; use inside grids so it matches `w-full` inputs on mobile. */
export const DATE_INPUT_SHRINK_CLASS = "min-w-0 max-w-full";
