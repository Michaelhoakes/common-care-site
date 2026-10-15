"use client";

import {
  ArrowPathIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  AVAILABILITY_PREFERENCES,
  FIELD_TOOLTIPS,
  INSURER_MEMBER_ID_HINTS,
  INSURERS,
  RELATIONSHIP_OPTIONS,
  isUnsupportedInsurerId,
  type AvailabilityPreferenceId,
  type RelationshipId,
} from "../../insurance/config/verificationFormConfig";
import { clampIsoDateInputYear, dateOfBirthFieldError } from "../../insurance/lib/dobIso";
import {
  DATE_INPUT_SHRINK_CLASS,
  INPUT_INVALID_CLASS,
} from "../../insurance/lib/formFieldStyles";
import { formatUsPhoneInput } from "../../insurance/lib/formatUsPhone";
import { FieldTooltip } from "../../insurance/components/FieldTooltip";
import { InsurerCombobox } from "../../insurance/components/InsurerCombobox";
import { RelationshipDropdown } from "../../insurance/components/RelationshipDropdown";
import { AddressAutocomplete } from "../../components/AddressAutocomplete";
import Link from "next/link";

const BOOK_EVALUATION_BASIN_ENDPOINT =
  "https://usebasin.com/f/93f0c8727ad2";

const inputClass =
  "w-full rounded-lg border border-forest/12 bg-white px-3.5 py-2.5 text-[14px] text-forest placeholder:text-forest/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] focus:outline-none focus:ring-0 focus:border-darkgreen focus:outline focus:outline-[2px] focus:outline-darkgreen focus:outline-offset-[-1px]";

const labelClass =
  "text-[14px] font-normal text-darkgreen tracking-normal leading-[normal]";

const sectionTitleClass =
  "font-hero-display text-lg font-normal text-darkgreen md:text-xl";

/** 4px below control; ! overrides global `p` margins in globals.css */
const hintBelowInput = "!mt-[4px] !mb-0 text-[14px] leading-[18px] text-forest/80";

const errBelowInput =
  "!mt-[4px] !mb-0 text-[13px] !leading-[normal] text-red-700/90";

type InsuranceSelectionId = "out_of_pocket" | "using_insurance" | "unsure";

type InsuranceSelectionValue = InsuranceSelectionId | "";

type HearAboutId =
  | "friend_or_referral"
  | "gym_studio"
  | "social_media"
  | "google_search"
  | "event"
  | "other";

const HEAR_ABOUT_OPTIONS: readonly { id: HearAboutId; label: string }[] = [
  { id: "friend_or_referral", label: "Friend or referral" },
  { id: "gym_studio", label: "Gym / studio" },
  { id: "social_media", label: "Social media" },
  { id: "google_search", label: "Google search" },
  { id: "event", label: "Event" },
  { id: "other", label: "Other" },
] as const;

const INSURANCE_SELECTION_OPTIONS: readonly {
  id: InsuranceSelectionId;
  label: string;
}[] = [
  { id: "out_of_pocket", label: "I’ll be paying out of pocket" },
  { id: "using_insurance", label: "I’d like to use insurance" },
  { id: "unsure", label: "I’m not sure yet" },
] as const;

export type BookEvaluationPayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  addressFormatted: string;
  hearAbout: HearAboutId[];
  hearAboutOther: string;
  availabilityPreferences: AvailabilityPreferenceId[];
  schedulingNotes: string;
  notes: string;
  insuranceSelection: InsuranceSelectionValue;

  // Insurance details (optional; included in payload only when provided)
  insuranceProviderId: string;
  insuranceProviderLabel: string;
  insuranceProviderOtherName: string;
  memberId: string;
  groupNumber: string;
  policyholderFirstName: string;
  policyholderLastName: string;
  policyholderDateOfBirth: string;
  relationshipToPolicyholder: RelationshipId;
};

const emptyForm: BookEvaluationPayload = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  addressFormatted: "",
  hearAbout: [],
  hearAboutOther: "",
  availabilityPreferences: [],
  schedulingNotes: "",
  notes: "",
  insuranceSelection: "",

  insuranceProviderId: "",
  insuranceProviderLabel: "",
  insuranceProviderOtherName: "",
  memberId: "",
  groupNumber: "",
  policyholderFirstName: "",
  policyholderLastName: "",
  policyholderDateOfBirth: "",
  relationshipToPolicyholder: "self",
};

function normalizePhone(raw: string) {
  return raw.replace(/\D/g, "");
}

function validate(
  data: BookEvaluationPayload
): Partial<Record<keyof BookEvaluationPayload | "_general", string>> {
  const e: Partial<Record<keyof BookEvaluationPayload | "_general", string>> =
    {};

  if (!data.firstName.trim()) e.firstName = "Add a first name";
  if (!data.lastName.trim()) e.lastName = "Add a last name";

  const dobErr = dateOfBirthFieldError(data.dateOfBirth, {
    required: true,
    emptyMessage: "Add your date of birth",
  });
  if (dobErr) e.dateOfBirth = dobErr;

  if (data.policyholderDateOfBirth.trim()) {
    const phDobErr = dateOfBirthFieldError(data.policyholderDateOfBirth, {
      required: false,
    });
    if (phDobErr) e.policyholderDateOfBirth = phDobErr;
  }

  const em = data.email.trim();
  if (!em) e.email = "Add an email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
    e.email = "Check the email format";

  const phone = normalizePhone(data.phone);
  if (!phone) e.phone = "Add a phone number";
  else if (phone.length < 10)
    e.phone = "That number looks short—double-check if you can";

  if (data.hearAbout.includes("other") && !data.hearAboutOther.trim()) {
    e.hearAboutOther = "Tell us where you heard about us";
  }

  if (!data.addressLine1.trim()) e.addressLine1 = "Add your address";

  if (!data.insuranceSelection) e.insuranceSelection = "Choose one option";

  const usingInsurance = data.insuranceSelection === "using_insurance";
  const unsupportedInsurance = isUnsupportedInsurerId(data.insuranceProviderId);

  if (
    usingInsurance &&
    !unsupportedInsurance &&
    data.insuranceProviderId === "other" &&
    !data.insuranceProviderOtherName.trim()
  ) {
    e.insuranceProviderOtherName = "Enter your insurance provider";
  }

  return e;
}

function FieldHintOrError({
  hint,
  error,
  idHint,
  idErr,
}: {
  hint?: ReactNode;
  error?: string;
  idHint: string;
  idErr: string;
}) {
  return (
    <>
      {hint && !error && (
        <p id={idHint} className={hintBelowInput}>
          {hint}
        </p>
      )}
      {error && (
        <p id={idErr} className={errBelowInput} role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export default function BookEvaluationForm() {
  const [form, setForm] = useState<BookEvaluationPayload>(emptyForm);
  const [touched, setTouched] = useState<
    Partial<Record<keyof BookEvaluationPayload, boolean>>
  >({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookEvaluationPayload | "_general", string>>
  >({});
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const setField = useCallback(
    <K extends keyof BookEvaluationPayload>(
      key: K,
      value: BookEvaluationPayload[K]
    ) => {
      setForm((f) => {
        const next = { ...f, [key]: value };
        if (
          key === "relationshipToPolicyholder" &&
          (value as RelationshipId) === "self"
        ) {
          next.policyholderFirstName = "";
          next.policyholderLastName = "";
          next.policyholderDateOfBirth = "";
        }

        // For phone/email: validate only after the user leaves the field once.
        // Before that, we just clear any prior errors while they type.
        const shouldRealtimeValidate =
          (key === "phone" || key === "email") && !!touched[key];

        setErrors((er) => {
          const n = { ...er };
          if (shouldRealtimeValidate) {
            const v = validate(next);
            const msg = v[key];
            if (msg) {
              n[key] = msg;
            } else {
              delete n[key];
            }
          } else {
            delete n[key];
          }
          return n;
        });

        return next;
      });

      // Mark other fields as touched on interaction; phone/email are only touched on blur.
      if (key !== "phone" && key !== "email") {
        setTouched((t) => ({ ...t, [key]: true }));
      }
    },
    [touched]
  );

  const toggleAvailabilityPreference = useCallback(
    (id: AvailabilityPreferenceId) => {
      setForm((f) => {
        const has = f.availabilityPreferences.includes(id);
        const nextIds = has
          ? f.availabilityPreferences.filter((x) => x !== id)
          : [...f.availabilityPreferences, id];
        // Keep a stable order aligned with `AVAILABILITY_PREFERENCES`.
        const ordered = AVAILABILITY_PREFERENCES.filter((a) =>
          nextIds.includes(a.id)
        ).map((a) => a.id);
        return { ...f, availabilityPreferences: ordered };
      });
      setTouched((t) => ({ ...t, availabilityPreferences: true }));
      setErrors((er) => {
        const next = { ...er };
        delete next.availabilityPreferences;
        return next;
      });
    },
    []
  );

  const toggleHearAbout = useCallback((id: HearAboutId) => {
    setForm((f) => {
      const has = f.hearAbout.includes(id);
      const nextIds = has
        ? f.hearAbout.filter((x) => x !== id)
        : [...f.hearAbout, id];
      const ordered = HEAR_ABOUT_OPTIONS.filter((o) =>
        nextIds.includes(o.id)
      ).map((o) => o.id);
      return {
        ...f,
        hearAbout: ordered,
        hearAboutOther:
          id === "other" && has ? "" : f.hearAboutOther,
      };
    });

    setTouched((t) => ({
      ...t,
      hearAboutOther: id === "other" ? t.hearAboutOther : false,
    }));

    if (id === "other") {
      setErrors((er) => {
        const next = { ...er };
        delete next.hearAboutOther;
        return next;
      });
    }
  }, []);

  const onBlurKey = useCallback(
    (key: keyof BookEvaluationPayload) => {
      // Mark field as touched and validate immediately when they leave it.
      setTouched((t) => ({ ...t, [key]: true }));

      const v = validate(form);
      const msg = v[key];
      setErrors((er) => {
        const n = { ...er };
        if (msg) {
          n[key] = msg;
        } else {
          delete n[key];
        }
        return n;
      });
    },
    [form]
  );

  const setInsuranceSelection = useCallback(
    (next: InsuranceSelectionId) => {
      setForm((f) => {
        if (next === "using_insurance") {
          return { ...f, insuranceSelection: next };
        }
        return {
          ...f,
          insuranceSelection: next,
          insuranceProviderId: "",
          insuranceProviderLabel: "",
          insuranceProviderOtherName: "",
          memberId: "",
          groupNumber: "",
          policyholderFirstName: "",
          policyholderLastName: "",
          policyholderDateOfBirth: "",
          relationshipToPolicyholder: "self",
        };
      });
      setTouched((t) => ({ ...t, insuranceSelection: true }));
      setErrors((er) => {
        const n = { ...er };
        delete n.insuranceSelection;
        return n;
      });
    },
    []
  );

  const memberIdExtra = useMemo(() => {
    return form.insuranceProviderId
      ? INSURER_MEMBER_ID_HINTS[form.insuranceProviderId]
      : undefined;
  }, [form.insuranceProviderId]);

  const showInsuranceDetails = form.insuranceSelection === "using_insurance";
  const unsupportedInsuranceSelected =
    showInsuranceDetails && isUnsupportedInsurerId(form.insuranceProviderId);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      email: true,
      phone: true,
      addressLine1: true,
      addressLine2: true,
      hearAboutOther: true,
      insuranceSelection: true,
      insuranceProviderOtherName: true,
      policyholderDateOfBirth: true,
      notes: true,
    });

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) {
      requestAnimationFrame(() => {
        const firstInvalid =
          document.querySelector<HTMLElement>(
            "input[aria-invalid='true'], textarea[aria-invalid='true']"
          ) ?? document.getElementById("be-hear-about");
        firstInvalid?.focus?.();
        firstInvalid?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    setStatus("loading");
    setErrors((er) => {
      const n = { ...er };
      delete n._general;
      return n;
    });

    e.currentTarget.submit();
  };

  const retry = () => {
    setStatus("idle");
    setErrors((er) => {
      const n = { ...er };
      delete n._general;
      return n;
    });
  };

  return (
    <>
      <form
        className="mt-8 max-w-2xl"
        action={BOOK_EVALUATION_BASIN_ENDPOINT}
        method="POST"
        onSubmit={submit}
        noValidate
        aria-busy={status === "loading"}
      >
        <input
          type="hidden"
          name="_subject"
          value="Book Evaluation Request"
        />
        <input
          type="hidden"
          name="insurance_provider"
          value={
            form.insuranceSelection !== "using_insurance" ||
            unsupportedInsuranceSelected
              ? ""
              : form.insuranceProviderId === "other"
                ? form.insuranceProviderOtherName
                : form.insuranceProviderLabel
          }
        />
        <input
          type="hidden"
          name="full_name"
          value={`${form.firstName} ${form.lastName}`}
        />
        <input
          type="hidden"
          name="availability_preferences"
          value={form.availabilityPreferences.join(", ")}
        />
        <input
          type="hidden"
          name="hear_about"
          value={form.hearAbout.join(", ")}
        />
        <input type="hidden" name="city" value={form.city} />
        <input type="hidden" name="state" value={form.state} />
        <input type="hidden" name="zip_code" value={form.zipCode} />
        <input
          type="hidden"
          name="address_formatted"
          value={form.addressFormatted}
        />
        <input
          type="hidden"
          name="relationship_to_policyholder"
          value={form.relationshipToPolicyholder}
        />
        <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-[0_2px_24px_rgba(31,52,20,0.06)] md:p-9">
        {errors._general && (
          <div
            className="mb-6 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-[14px] text-red-900/90"
            role="alert"
            tabIndex={-1}
          >
            {errors._general}
            <button
              type="button"
              onClick={retry}
              className="mt-2 block text-[13px] font-medium text-red-800 underline underline-offset-2 hover:text-red-950"
            >
              Try again
            </button>
          </div>
        )}

        {/* Personal */}
        <div>
          <h3 className={sectionTitleClass}>Your details</h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="be-first" className={`${labelClass} mb-1.5 block`}>
                First name
              </label>
              <input
                id="be-first"
                name="firstName"
                autoComplete="given-name"
                className={`${inputClass} ${
                  touched.firstName && errors.firstName ? INPUT_INVALID_CLASS : ""
                }`}
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                aria-invalid={!!(touched.firstName && errors.firstName)}
              />
              <FieldHintOrError
                idHint="be-first-h"
                idErr="be-first-err"
                error={touched.firstName ? errors.firstName : undefined}
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="be-last" className={`${labelClass} mb-1.5 block`}>
                Last name
              </label>
              <input
                id="be-last"
                name="lastName"
                autoComplete="family-name"
                className={`${inputClass} ${
                  touched.lastName && errors.lastName ? INPUT_INVALID_CLASS : ""
                }`}
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
                aria-invalid={!!(touched.lastName && errors.lastName)}
              />
              <FieldHintOrError
                idHint="be-last-h"
                idErr="be-last-err"
                error={touched.lastName ? errors.lastName : undefined}
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="be-dob" className={`${labelClass} mb-1.5 block`}>
                Date of birth
              </label>
              <input
                id="be-dob"
                name="dateOfBirth"
                type="date"
                autoComplete="bday"
                className={`${inputClass} ${
                  touched.dateOfBirth && errors.dateOfBirth
                    ? INPUT_INVALID_CLASS
                    : ""
                } ${form.dateOfBirth ? "text-forest" : "text-forest/50"}`}
                value={form.dateOfBirth}
                onChange={(e) =>
                  setField("dateOfBirth", clampIsoDateInputYear(e.target.value))
                }
                onBlur={() => onBlurKey("dateOfBirth")}
                aria-invalid={!!(touched.dateOfBirth && errors.dateOfBirth)}
              />
              {touched.dateOfBirth && errors.dateOfBirth && (
                <p id="be-dob-err" className={errBelowInput} role="alert">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="be-phone" className={`${labelClass} mb-1.5 block`}>
                Phone number
              </label>
              <input
                id="be-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(555) 123-4567"
                className={`${inputClass} ${
                  touched.phone && errors.phone ? INPUT_INVALID_CLASS : ""
                }`}
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setField("phone", formatUsPhoneInput(digits));
                }}
                onBlur={() => onBlurKey("phone")}
                aria-invalid={!!(touched.phone && errors.phone)}
              />
              <FieldHintOrError
                idHint="be-phone-h"
                idErr="be-phone-err"
                error={touched.phone ? errors.phone : undefined}
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="be-email" className={`${labelClass} mb-1.5 block`}>
                Email
              </label>
              <input
                id="be-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`${inputClass} ${
                  touched.email && errors.email ? INPUT_INVALID_CLASS : ""
                }`}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlurKey("email")}
                aria-invalid={!!(touched.email && errors.email)}
              />
              <FieldHintOrError
                idHint="be-email-h"
                idErr="be-email-err"
                error={touched.email ? errors.email : undefined}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="be-address" className={`${labelClass} mb-1.5 block`}>
                Address
              </label>
              <AddressAutocomplete
                id="be-address"
                value={form.addressLine1}
                onChange={({ text, parts }) => {
                  setForm((f) => ({
                    ...f,
                    addressLine1: text,
                    ...(parts
                      ? {
                          addressFormatted: parts.formattedAddress ?? "",
                          city: parts.city ?? "",
                          state: parts.state ?? "",
                          zipCode: parts.zipCode ?? "",
                        }
                      : {}),
                  }));
                  setTouched((t) => ({ ...t, addressLine1: true }));
                  setErrors((er) => {
                    const next = { ...er };
                    if (!text.trim()) next.addressLine1 = "Add your address";
                    else delete next.addressLine1;
                    return next;
                  });
                }}
                placeholder="Street address"
                className={`${inputClass} ${
                  touched.addressLine1 && errors.addressLine1
                    ? INPUT_INVALID_CLASS
                    : ""
                }`}
                ariaInvalid={!!(touched.addressLine1 && errors.addressLine1)}
                ariaDescribedBy={
                  touched.addressLine1 && errors.addressLine1
                    ? "be-address-err"
                    : "be-address-h"
                }
                onBlur={() => onBlurKey("addressLine1")}
              />
              <FieldHintOrError
                idHint="be-address-h"
                idErr="be-address-err"
                error={
                  touched.addressLine1 ? errors.addressLine1 : undefined
                }
              />

              <div className="mt-6">
                <label
                  htmlFor="be-address2"
                  className={`${labelClass} mb-1.5 block`}
                >
                  Address line 2{" "}
                  <span className="font-normal text-forest/70">(optional)</span>
                </label>
                <input
                  id="be-address2"
                  name="addressLine2"
                  type="text"
                  autoComplete="off"
                  className={`${inputClass} ${
                    touched.addressLine2 && errors.addressLine2
                      ? INPUT_INVALID_CLASS
                      : ""
                  }`}
                  value={form.addressLine2}
                  onChange={(e) => setField("addressLine2", e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, addressLine2: true }))
                  }
                  aria-invalid={!!(touched.addressLine2 && errors.addressLine2)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 h-px w-full bg-forest/10" aria-hidden />

        {/* Visit details (as-is UI from insurance page) */}
        <div>
          <h3 className={sectionTitleClass}>Visit details</h3>
          <div className="mt-6 min-w-0">
            <div
              id="be-availability-heading"
              className={`${labelClass} !mb-0`}
            >
              Preferred availability{" "}
              <span className="font-normal text-forest/70">(optional)</span>
            </div>
            <div
              className="mt-3 grid gap-3 sm:grid-cols-2"
              role="group"
              aria-labelledby="be-availability-heading"
            >
              {AVAILABILITY_PREFERENCES.map((a) => {
                const checked = form.availabilityPreferences.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={`flex min-h-[2.75rem] cursor-pointer items-center gap-2.5 rounded-lg border p-[12px] text-left text-[14px] transition-[border-color,background] has-[:focus-visible]:outline has-[:focus-visible]:outline-[2px] has-[:focus-visible]:outline-darkgreen has-[:focus-visible]:outline-offset-0 ${
                      checked
                        ? "border-darkgreen bg-matcha/[0.06] text-forest"
                        : "border-forest/10 bg-white text-forest/90 hover:border-forest/18"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`availability.${a.id}`}
                      value={a.id}
                      checked={checked}
                      onChange={() => toggleAvailabilityPreference(a.id)}
                      className="sr-only"
                    />
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-forest/25 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      aria-hidden
                    >
                      {checked && (
                        <svg
                          className="h-3 w-3 text-darkgreen"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 6l2.5 2.5L9.5 3.5" />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium leading-snug">{a.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="be-scheduling-notes"
              className={`${labelClass} mb-1.5 block`}
            >
              Scheduling notes{" "}
              <span className="font-normal text-forest/70">(optional)</span>
            </label>
            <input
              id="be-scheduling-notes"
              name="schedulingNotes"
              type="text"
              autoComplete="off"
              placeholder="e.g. Tuesdays and Thursdays after 2pm are best"
              className={inputClass}
              value={form.schedulingNotes}
              onChange={(e) => setField("schedulingNotes", e.target.value)}
            />
          </div>

          <div className="my-10 h-px w-full bg-forest/10" aria-hidden />

          <div>
            <fieldset className="min-w-0">
              <legend className={`${labelClass} mb-3 block`}>
                Will you be using insurance?
              </legend>
              <div className="grid gap-3">
                {INSURANCE_SELECTION_OPTIONS.map((opt) => {
                  const checked = form.insuranceSelection === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex min-h-[2.75rem] cursor-pointer items-center justify-start gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[14px] transition-[border-color,background] has-[:focus-visible]:outline has-[:focus-visible]:outline-[2px] has-[:focus-visible]:outline-darkgreen has-[:focus-visible]:outline-offset-0 ${
                        checked
                          ? "border-darkgreen bg-matcha/[0.06] text-forest"
                          : "border-forest/12 bg-white text-forest/90 hover:border-forest/20"
                      }`}
                    >
                      <span className="font-medium text-[14px]">{opt.label}</span>
                      <input
                        type="radio"
                        name="insuranceSelection"
                        value={opt.id}
                        checked={checked}
                        onChange={() => setInsuranceSelection(opt.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {touched.insuranceSelection && errors.insuranceSelection && (
              <p id="be-insurance-selection-err" className={errBelowInput} role="alert">
                {errors.insuranceSelection}
              </p>
            )}

            <div
              className={`transition-[max-height,opacity,margin] duration-300 ${
                showInsuranceDetails
                  ? "mt-6 max-h-[1200px] opacity-100 visible overflow-visible"
                  : "mt-0 max-h-0 opacity-0 invisible pointer-events-none overflow-hidden"
              }`}
              aria-hidden={!showInsuranceDetails}
            >
              <h4 className="font-hero-display text-lg font-normal text-darkgreen">
                Insurance details
              </h4>
              {!unsupportedInsuranceSelected && (
                <p className="!mt-[12px] flex items-start gap-2 text-[14px] leading-[18px] text-forest/80 !mb-0">
                  <CheckCircleIcon
                    className="mt-[1px] h-4 w-4 shrink-0 text-forest/80"
                    aria-hidden
                  />
                  <span>
                    We&apos;ll review your out-of-network benefits and follow
                    up with your estimated cost before confirming your visit.
                  </span>
                </p>
              )}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="be-carrier"
                    className={`${labelClass} mb-1.5 block`}
                  >
                    Insurance provider
                  </label>
                  <InsurerCombobox
                    id="be-carrier"
                    insurers={INSURERS}
                    value={form.insuranceProviderId}
                    invalid={false}
                    onChange={(id, label) => {
                      setForm((f) => ({
                        ...f,
                        insuranceProviderId: id,
                        insuranceProviderLabel: label,
                        insuranceProviderOtherName:
                          id === "other" ? f.insuranceProviderOtherName : "",
                      }));
                    }}
                  />

                  {form.insuranceProviderId === "other" &&
                    !unsupportedInsuranceSelected && (
                      <div className="mt-6">
                        <label
                          htmlFor="be-insurance-provider-other"
                          className={`${labelClass} mb-1.5 block`}
                        >
                          Insurance provider name
                        </label>
                        <input
                          id="be-insurance-provider-other"
                          name="insuranceProviderOtherName"
                          autoComplete="off"
                          placeholder="Enter your insurance provider"
                          className={inputClass}
                          value={form.insuranceProviderOtherName}
                          onChange={(e) =>
                            setField(
                              "insuranceProviderOtherName",
                              e.target.value
                            )
                          }
                          onBlur={() =>
                            onBlurKey("insuranceProviderOtherName")
                          }
                          aria-invalid={!!(
                            touched.insuranceProviderOtherName &&
                            errors.insuranceProviderOtherName
                          )}
                        />
                        {touched.insuranceProviderOtherName &&
                          errors.insuranceProviderOtherName && (
                            <p className={errBelowInput} role="alert">
                              {errors.insuranceProviderOtherName}
                            </p>
                          )}
                      </div>
                    )}
                </div>

                {unsupportedInsuranceSelected && (
                  <div className="sm:col-span-2 rounded-lg border border-forest/[0.07] bg-bone/40 px-4 py-3 text-[14px] text-forest/80">
                    <div className="flex items-start gap-2">
                      <InformationCircleIcon
                        className="mt-[1px] h-4 w-4 shrink-0 text-forest/80"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="!m-0 font-medium text-forest">
                          Unsupported insurance
                        </p>
                        <p className={`${hintBelowInput} !mt-1 !mb-0`}>
                          Common Care does not accept Medicare or Medicaid. If
                          you&apos;d still like to request a visit, you&apos;re
                          welcome to continue as an out-of-pocket patient.
                        </p>
                        <button
                          type="button"
                          onClick={() => setInsuranceSelection("out_of_pocket")}
                          className="mt-3 text-[13px] font-medium text-darkgreen underline underline-offset-2 hover:text-forest"
                        >
                          Continue as out of pocket
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!unsupportedInsuranceSelected && (
                  <>
                <div className="sm:col-span-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <label
                      htmlFor="be-member"
                      className={`${labelClass} !mb-0`}
                    >
                      Member ID / Subscriber ID
                    </label>
                    <FieldTooltip
                      fieldLabel="Member ID"
                      lines={FIELD_TOOLTIPS.memberId}
                      extraHint={memberIdExtra}
                      panelClassName="w-[min(18rem,calc(100vw-2rem))]"
                    />
                  </div>
                  <input
                    id="be-member"
                    name="memberId"
                    autoComplete="off"
                    className={inputClass}
                    value={form.memberId}
                    onChange={(e) =>
                      setField("memberId", e.target.value)
                    }
                  />
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor="be-group"
                    className={`${labelClass} mb-1.5 block`}
                  >
                    Group number{" "}
                    <span className="font-normal text-forest/70">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="be-group"
                    name="groupNumber"
                    autoComplete="off"
                    className={inputClass}
                    value={form.groupNumber}
                    onChange={(e) =>
                      setField("groupNumber", e.target.value)
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="be-rel"
                    className={`${labelClass} mb-1.5 block`}
                  >
                    Relationship to policyholder
                  </label>
                  <RelationshipDropdown
                    id="be-rel"
                    value={form.relationshipToPolicyholder}
                    options={RELATIONSHIP_OPTIONS}
                    onChange={(id) =>
                      setField("relationshipToPolicyholder", id)
                    }
                  />
                </div>

                {form.relationshipToPolicyholder !== "self" && (
                  <>
                    <div className="sm:col-span-2 rounded-lg border border-forest/[0.07] bg-bone/40 px-4 py-3 text-[14px] text-forest/80">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`${labelClass} !mb-0`}
                        >
                          Policyholder details
                        </span>
                        <FieldTooltip
                          fieldLabel="Policyholder"
                          lines={FIELD_TOOLTIPS.policyholder}
                        />
                      </div>
                      <p className={`${hintBelowInput} !mb-0`}>
                        Add your policy holder details to help us verify
                        your expected cost faster.
                      </p>
                    </div>

                    <div className="sm:col-span-1">
                      <label
                        htmlFor="be-ph-first"
                        className={`${labelClass} mb-1.5 block`}
                      >
                        Policyholder first name
                      </label>
                      <input
                        id="be-ph-first"
                        name="policyholderFirstName"
                        autoComplete="off"
                        className={inputClass}
                        value={form.policyholderFirstName}
                        onChange={(e) =>
                          setField("policyholderFirstName", e.target.value)
                        }
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label
                        htmlFor="be-ph-last"
                        className={`${labelClass} mb-1.5 block`}
                      >
                        Policyholder last name
                      </label>
                      <input
                        id="be-ph-last"
                        name="policyholderLastName"
                        autoComplete="off"
                        className={inputClass}
                        value={form.policyholderLastName}
                        onChange={(e) =>
                          setField("policyholderLastName", e.target.value)
                        }
                      />
                    </div>

                    <div className="min-w-0 sm:col-span-2 sm:max-w-xs">
                      <label
                        htmlFor="be-ph-dob"
                        className={`${labelClass} mb-1.5 block`}
                      >
                        Policyholder date of birth
                      </label>
                      <input
                        id="be-ph-dob"
                        name="policyholderDateOfBirth"
                        type="date"
                        className={`${inputClass} ${DATE_INPUT_SHRINK_CLASS} ${
                          touched.policyholderDateOfBirth &&
                          errors.policyholderDateOfBirth
                            ? INPUT_INVALID_CLASS
                            : ""
                        } ${
                          form.policyholderDateOfBirth
                            ? "text-forest"
                            : "text-forest/50"
                        }`}
                        value={form.policyholderDateOfBirth}
                        onChange={(e) =>
                          setField(
                            "policyholderDateOfBirth",
                            clampIsoDateInputYear(e.target.value)
                          )
                        }
                        onBlur={() => onBlurKey("policyholderDateOfBirth")}
                        aria-invalid={
                          !!(
                            touched.policyholderDateOfBirth &&
                            errors.policyholderDateOfBirth
                          )
                        }
                      />
                      {touched.policyholderDateOfBirth &&
                        errors.policyholderDateOfBirth && (
                          <p className={errBelowInput} role="alert">
                            {errors.policyholderDateOfBirth}
                          </p>
                        )}
                    </div>
                  </>
                )}
                </>
                )}
              </div>
            </div>
          </div>

          <div className="my-10 h-px w-full bg-forest/10" aria-hidden />

          <fieldset className="mt-0 min-w-0">
            <legend className={`${labelClass} mb-2 block`}>
              How did you hear about us?{" "}
              <span className="font-normal text-forest/70">(optional)</span>
            </legend>
            <div
              id="be-hear-about"
              className="grid gap-3 sm:grid-cols-2"
            >
              {HEAR_ABOUT_OPTIONS.map((opt) => {
                const checked = form.hearAbout.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`flex min-h-[2.75rem] cursor-pointer items-center gap-2.5 rounded-lg border p-[12px] text-left text-[14px] transition-[border-color,background] has-[:focus-visible]:outline has-[:focus-visible]:outline-[2px] has-[:focus-visible]:outline-darkgreen has-[:focus-visible]:outline-offset-0 ${
                      checked
                        ? "border-darkgreen bg-matcha/[0.06] text-forest"
                        : "border-forest/12 bg-white text-forest/90 hover:border-forest/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`hearAbout.${opt.id}`}
                      value={opt.id}
                      checked={checked}
                      onChange={() => toggleHearAbout(opt.id)}
                      className="sr-only"
                    />
                    <span
                      className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-forest/25 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                      aria-hidden
                    >
                      {checked && (
                        <svg
                          className="h-3 w-3 text-darkgreen"
                          viewBox="0 0 12 12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 6l2.5 2.5L9.5 3.5" />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium text-pretty">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {form.hearAbout.includes("other") && (
            <div className="mt-4">
              <label htmlFor="be-hear-about-other" className={`${labelClass} mb-1.5 block`}>
                Please share
              </label>
              <input
                id="be-hear-about-other"
                name="hearAboutOther"
                type="text"
                autoComplete="off"
                className={`${inputClass} ${
                  touched.hearAboutOther && errors.hearAboutOther
                    ? INPUT_INVALID_CLASS
                    : ""
                }`}
                value={form.hearAboutOther}
                onChange={(e) => setField("hearAboutOther", e.target.value)}
                onBlur={() => onBlurKey("hearAboutOther")}
                aria-invalid={!!(touched.hearAboutOther && errors.hearAboutOther)}
              />
              <FieldHintOrError
                idHint="be-hear-about-other-h"
                idErr="be-hear-about-other-err"
                error={touched.hearAboutOther ? errors.hearAboutOther : undefined}
              />
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-5">
          <button
            type="submit"
            disabled={status === "loading"}
            className="cc-btn-primary gap-2 disabled:pointer-events-none disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              "Request evaluation"
            )}
          </button>
          <p className="text-[14px] text-forest/80 !m-0 w-full text-left">
            By submitting, you agree to be contacted about your request and
            acknowledge our{" "}
            <Link
              href="/privacy"
              className="font-medium text-matcha !underline underline-offset-[0.2em] decoration-matcha/70 decoration-1 transition-none hover:opacity-90 hover:decoration-matcha"
            >
              Privacy Policy
            </Link>
            {" "}and{" "}
            <Link
              href="/terms"
              className="font-medium text-matcha !underline underline-offset-[0.2em] decoration-matcha/70 decoration-1 transition-none hover:opacity-90 hover:decoration-matcha"
            >
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
      </form>

      <div className="mt-10 max-w-2xl w-full">
        <h3 className="cc-heading-md text-darkgreen">What happens next</h3>
        <p className="care-body text-forest/90 !mb-0 mt-3">
          We&apos;ll follow up within 24 hours to confirm your availability, answer any questions, and review your benefits if needed.
        </p>
      </div>
    </>
  );
}

