/**
 * Insurance verification form — copy, insurer list, and hint overrides.
 * Keep UI dumb; import from components only.
 */

export type Insurer = {
  id: string;
  label: string;
};

/** Major US carriers — searchable; ids used for light insurer-aware hints only */
export const INSURERS: readonly Insurer[] = [
  { id: "aetna", label: "Aetna" },
  { id: "anthem", label: "Anthem" },
  { id: "bcbs", label: "Blue Cross Blue Shield" },
  { id: "bcbs_ca", label: "Blue Shield of California" },
  { id: "carefirst", label: "CareFirst" },
  { id: "cigna", label: "Cigna" },
  { id: "empire", label: "Empire BlueCross" },
  { id: "florida_blue", label: "Florida Blue" },
  { id: "geha", label: "GEHA" },
  { id: "healthnet", label: "Health Net" },
  { id: "highmark", label: "Highmark" },
  { id: "humana", label: "Humana" },
  { id: "independence", label: "Independence Blue Cross" },
  { id: "kaiser", label: "Kaiser Permanente" },
  { id: "medicaid", label: "Medicaid (Medi-Cal)" },
  { id: "medicare", label: "Medicare" },
  { id: "molina", label: "Molina Healthcare" },
  { id: "mvp", label: "MVP Health Care" },
  { id: "oscar", label: "Oscar" },
  { id: "premera", label: "Premera Blue Cross" },
  { id: "regence", label: "Regence" },
  { id: "sharp", label: "Sharp Health Plan" },
  { id: "tricare", label: "TRICARE" },
  { id: "uhc", label: "UnitedHealthcare" },
  { id: "umr", label: "UMR (United Medical Resources)" },
  { id: "wellmark", label: "Wellmark Blue Cross Blue Shield" },
  { id: "other", label: "Other / not listed" },
] as const;

/** Carriers Common Care does not accept for this intake flow. */
export const UNSUPPORTED_INSURER_IDS = new Set(["medicare", "medicaid"]);

export function isUnsupportedInsurerId(id: string): boolean {
  return UNSUPPORTED_INSURER_IDS.has((id || "").trim().toLowerCase());
}

export const SERVICE_TYPES = [
  {
    id: "care_evaluation",
    label: "Care Evaluation",
    /** Short line for tooltip next to “Type of service” */
    description:
      "Your first comprehensive visit—assessment, objective data, and starting treatment.",
  },
  {
    id: "care_sessions",
    label: "Care Sessions",
    description:
      "Ongoing one-on-one visits for hands-on care, movement work, and your plan.",
  },
  {
    id: "wellness_care",
    label: "Wellness Care",
    description:
      "Recovery-focused visits—e.g. oxygen, light, sound, compression, sauna.",
  },
] as const;

export type ServiceTypeId = (typeof SERVICE_TYPES)[number]["id"];

/** Preferred availability for follow-up (optional; not a booking grid). */
export const AVAILABILITY_PREFERENCES = [
  { id: "weekday_mornings", label: "Weekday mornings" },
  { id: "weekday_afternoons", label: "Weekday afternoons" },
  { id: "weekday_evenings", label: "Weekday evenings" },
  { id: "flexible", label: "Flexible" },
] as const;

export type AvailabilityPreferenceId =
  (typeof AVAILABILITY_PREFERENCES)[number]["id"];

/** One line per service for the legend tooltip (hover / tap). */
export const SERVICE_TYPE_TOOLTIP_LINES: readonly string[] = SERVICE_TYPES.map(
  (s) => `${s.label}: ${s.description}`
);

export const RELATIONSHIP_OPTIONS = [
  { id: "self", label: "I'm the policyholder" },
  { id: "spouse", label: "Spouse / partner" },
  { id: "parent", label: "Parent" },
  { id: "child", label: "Child" },
  { id: "other", label: "Other family / dependent" },
] as const;

export type RelationshipId = (typeof RELATIONSHIP_OPTIONS)[number]["id"];

/** Base tooltip copy (1–2 short lines each; non-technical) */
export const FIELD_TOOLTIPS = {
  memberId: [
    'Usually labeled "Member ID" or "Subscriber ID" on your card. Letters and numbers are both common.',
  ],
  groupNumber: [
    'Often printed as "Group #" or "Group ID." Some plans don\'t list one—that\'s okay.',
  ],
  policyholder: [
    "The person whose name the plan is under. That might be you or someone in your family.",
  ],
} as const;

/**
 * Extra line appended to the member-id helper when this insurer is selected.
 * Keep subtle — one short clause only.
 */
export const INSURER_MEMBER_ID_HINTS: Partial<Record<string, string>> = {
  bcbs: "May include a few letters at the beginning.",
  bcbs_ca: "May include a few letters at the beginning.",
  anthem: "May include a few letters at the beginning.",
  empire: "May include a few letters at the beginning.",
  independence: "May include a few letters at the beginning.",
  premera: "May include a few letters at the beginning.",
  wellmark: "May include a few letters at the beginning.",
  florida_blue: "May include a few letters at the beginning.",
  regence: "May include a few letters at the beginning.",
};
