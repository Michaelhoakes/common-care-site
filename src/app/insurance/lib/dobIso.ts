export const DOB_INVALID_MESSAGE = "Please enter a valid date of birth.";

/** Prevents more than 4 digits in the year segment of an ISO date (yyyy-mm-dd). */
export function clampIsoDateInputYear(value: string): string {
  if (!value) return "";
  const parts = value.split("-");
  if (parts[0] && parts[0].length > 4) {
    parts[0] = parts[0].slice(0, 4);
  }
  return parts.join("-");
}

/**
 * Validates a yyyy-mm-dd string. Uses the caller's local calendar date as "today".
 */
export function dateOfBirthFieldError(
  iso: string,
  options: { required: boolean; emptyMessage?: string }
): string | undefined {
  const trimmed = iso.trim();
  if (!trimmed) {
    return options.required
      ? options.emptyMessage ?? "Add your date of birth"
      : undefined;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return DOB_INVALID_MESSAGE;
  }

  const y = Number(trimmed.slice(0, 4));
  const mo = Number(trimmed.slice(5, 7));
  const da = Number(trimmed.slice(8, 10));
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(da)) {
    return DOB_INVALID_MESSAGE;
  }

  const birth = new Date(y, mo - 1, da);
  if (
    birth.getFullYear() !== y ||
    birth.getMonth() !== mo - 1 ||
    birth.getDate() !== da
  ) {
    return DOB_INVALID_MESSAGE;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (birth > today) {
    return DOB_INVALID_MESSAGE;
  }

  let age = today.getFullYear() - birth.getFullYear();
  const mDiff = today.getMonth() - birth.getMonth();
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age > 120) {
    return DOB_INVALID_MESSAGE;
  }

  return undefined;
}
