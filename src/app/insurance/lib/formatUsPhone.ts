/** Display format (XXX) XXX-XXXX; strip with replace(/\D/g, "") for API. */
export function formatUsPhoneInput(digitsOnly: string): string {
  const d = digitsOnly.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
