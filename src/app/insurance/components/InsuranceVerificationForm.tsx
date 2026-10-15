"use client";

import { ArrowPathIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
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
} from "../config/verificationFormConfig";
import { clampIsoDateInputYear, dateOfBirthFieldError } from "../lib/dobIso";
import {
  DATE_INPUT_SHRINK_CLASS,
  INPUT_INVALID_CLASS,
} from "../lib/formFieldStyles";
import { formatUsPhoneInput } from "../lib/formatUsPhone";
import { AddressAutocomplete } from "../../components/AddressAutocomplete";
import { FieldTooltip } from "./FieldTooltip";
import { InsurerCombobox } from "./InsurerCombobox";
import { RelationshipDropdown } from "./RelationshipDropdown";
import Link from "next/link";

const inputClass =
  "w-full rounded-lg border border-forest/12 bg-white px-3.5 py-2.5 text-[14px] text-forest placeholder:text-forest/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] focus:outline-none focus:ring-0 focus:border-darkgreen focus:outline focus:outline-[2px] focus:outline-darkgreen focus:outline-offset-[-1px]";

const labelClass =
  "text-[14px] font-normal text-darkgreen tracking-normal leading-[normal]";
const sectionTitleClass =
  "font-hero-display text-lg font-normal text-darkgreen md:text-xl";
/** 4px below control; ! overrides global `p` margins in globals.css */
const hintBelowInput =
  "!mt-[4px] !mb-0 text-[14px] leading-[18px] text-forest/80";
const errBelowInput =
  "!mt-[8px] !mb-0 text-[13px] !leading-[normal] text-red-700/90";

type InsuranceSelectionId = "using_insurance" | "out_of_pocket";

export type InsuranceVerificationPayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  addressFormatted: string;
  insuranceProviderId: string;
  insuranceProviderLabel: string;
  insuranceProviderOtherName: string;
  memberId: string;
  groupNumber: string;
  policyholderFirstName: string;
  policyholderLastName: string;
  policyholderDateOfBirth: string;
  relationshipToPolicyholder: RelationshipId;
  insuranceSelection: InsuranceSelectionId;
  hearAbout: (
    | "friend_or_referral"
    | "gym_studio"
    | "social_media"
    | "google_search"
    | "event"
    | "other"
  )[];
  hearAboutOther: string;
  availabilityPreferences: AvailabilityPreferenceId[];
  schedulingNotes: string;
  notes: string;
};

const HEAR_ABOUT_OPTIONS: readonly {
  id:
    | "friend_or_referral"
    | "gym_studio"
    | "social_media"
    | "google_search"
    | "event"
    | "other";
  label: string;
}[] = [
  { id: "friend_or_referral", label: "Friend or referral" },
  { id: "gym_studio", label: "Gym / studio" },
  { id: "social_media", label: "Social media" },
  { id: "google_search", label: "Google search" },
  { id: "event", label: "Event" },
  { id: "other", label: "Other" },
] as const;

const emptyForm: InsuranceVerificationPayload = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  addressFormatted: "",
  insuranceProviderId: "",
  insuranceProviderLabel: "",
  insuranceProviderOtherName: "",
  memberId: "",
  groupNumber: "",
  policyholderFirstName: "",
  policyholderLastName: "",
  policyholderDateOfBirth: "",
  relationshipToPolicyholder: "self",
  insuranceSelection: "using_insurance",
  hearAbout: [],
  hearAboutOther: "",
  availabilityPreferences: [],
  schedulingNotes: "",
  notes: "",
};

function normalizePhone(raw: string) {
  return raw.replace(/\D/g, "");
}

function validate(
  data: InsuranceVerificationPayload
): Partial<Record<keyof InsuranceVerificationPayload | "_general", string>> {
  const e: Partial<Record<keyof InsuranceVerificationPayload | "_general", string>> =
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

  const phone = normalizePhone(data.phone);
  if (!phone) e.phone = "Add a phone number";
  else if (phone.length < 10) e.phone = "That number looks short—double-check if you can";

  const em = data.email.trim();
  if (!em) e.email = "Add an email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
    e.email = "Check the email format";

  if (!data.addressLine1.trim()) e.addressLine1 = "Add your address";

  const unsupportedInsurance = isUnsupportedInsurerId(data.insuranceProviderId);
  const usingInsurance = data.insuranceSelection === "using_insurance";

  if (usingInsurance && !data.insuranceProviderId) {
    e.insuranceProviderId = "Choose your insurance carrier";
  }

  if (usingInsurance && !unsupportedInsurance && !data.memberId.trim()) {
    e.memberId = "Member or subscriber ID helps us verify faster";
  }

  if (
    usingInsurance &&
    !unsupportedInsurance &&
    data.insuranceProviderId === "other" &&
    !data.insuranceProviderOtherName.trim()
  ) {
    e.insuranceProviderOtherName = "Enter your insurance provider";
  }

  if (data.hearAbout.includes("other") && !data.hearAboutOther.trim()) {
    e.hearAboutOther = "Tell us where you heard about us";
  }

  return e;
}

function LabelWithTip({
  htmlFor,
  children,
  tooltip,
}: {
  htmlFor: string;
  children: ReactNode;
  tooltip?: { fieldLabel: string; lines: readonly string[]; extraHint?: string };
}) {
  return (
    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {children}
      </label>
      {tooltip && (
        <FieldTooltip
          fieldLabel={tooltip.fieldLabel}
          lines={tooltip.lines}
          extraHint={tooltip.extraHint}
        />
      )}
    </div>
  );
}

export default function InsuranceVerificationForm() {
  const [form, setForm] = useState<InsuranceVerificationPayload>(emptyForm);
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [errors, setErrors] = useState<
    Partial<Record<keyof InsuranceVerificationPayload | "_general", string>>
  >({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const memberIdExtra = useMemo(() => {
    if (!form.insuranceProviderId) return undefined;
    return INSURER_MEMBER_ID_HINTS[form.insuranceProviderId];
  }, [form.insuranceProviderId]);
  const usingInsurance = form.insuranceSelection === "using_insurance";
  const unsupportedInsuranceSelected =
    usingInsurance && isUnsupportedInsurerId(form.insuranceProviderId);

  const setField = useCallback(
    <K extends keyof InsuranceVerificationPayload,>(
      key: K,
      value: InsuranceVerificationPayload[K]
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
          (key === "phone" || key === "email") && !!touched[key as string];

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

  const toggleAvailabilityPreference = useCallback((id: AvailabilityPreferenceId) => {
    setForm((f) => {
      const has = f.availabilityPreferences.includes(id);
      const nextIds = has
        ? f.availabilityPreferences.filter((x) => x !== id)
        : [...f.availabilityPreferences, id];
      const ordered = AVAILABILITY_PREFERENCES.filter((a) =>
        nextIds.includes(a.id)
      ).map((a) => a.id);
      return { ...f, availabilityPreferences: ordered };
    });
  }, []);

  const toggleHearAbout = useCallback(
    (
      id:
        | "friend_or_referral"
        | "gym_studio"
        | "social_media"
        | "google_search"
        | "event"
        | "other"
    ) => {
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
          hearAboutOther: id === "other" && has ? "" : f.hearAboutOther,
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
    },
    []
  );

  const runValidate = useCallback(() => {
    const v = validate(form);
    setErrors(v);
    return Object.keys(v).length === 0;
  }, [form]);

  const onBlurKey = (key: keyof InsuranceVerificationPayload) => {
    setTouched((t) => ({ ...t, [key]: true }));
    const v = validate(form);
    if (v[key]) setErrors((e) => ({ ...e, [key]: v[key] }));
    else setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(
      Object.fromEntries(
        Object.keys(form).map((k) => [k, true])
      ) as Record<string, boolean>
    );
    if (!runValidate()) {
      requestAnimationFrame(() => {
        const invalid =
          document.querySelector<HTMLElement>(
            "input[aria-invalid='true'], textarea[aria-invalid='true'], select[aria-invalid='true']"
          ) ?? document.getElementById("iv-hear-about");
        invalid?.focus();
        invalid?.scrollIntoView({ block: "center", behavior: "smooth" });
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
    <form
      className="mt-8 max-w-2xl"
      onSubmit={submit}
      action="https://usebasin.com/f/15a38fe61272"
      method="POST"
      noValidate
      aria-busy={status === "loading"}
    >
      <input
        type="hidden"
        name="_subject"
        value="Insurance Verification Request"
      />
      <input
        type="hidden"
        name="insurance_provider"
        value={
          form.insuranceProviderId === "other"
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
              <label htmlFor="iv-first" className={`${labelClass} mb-1.5 block`}>
                First name
              </label>
              <input
                id="iv-first"
                name="first_name"
                autoComplete="given-name"
                className={`${inputClass} ${errors.firstName ? INPUT_INVALID_CLASS : ""}`}
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                onBlur={() => onBlurKey("firstName")}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "iv-first-err" : undefined}
              />
              {touched.firstName && errors.firstName && (
                <p id="iv-first-err" className={errBelowInput} role="alert">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="iv-last" className={`${labelClass} mb-1.5 block`}>
                Last name
              </label>
              <input
                id="iv-last"
                name="last_name"
                autoComplete="family-name"
                className={`${inputClass} ${errors.lastName ? INPUT_INVALID_CLASS : ""}`}
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                onBlur={() => onBlurKey("lastName")}
                aria-invalid={!!errors.lastName}
              />
              {touched.lastName && errors.lastName && (
                <p className={errBelowInput} role="alert">{errors.lastName}</p>
              )}
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="iv-dob" className={`${labelClass} mb-1.5 block`}>
                Date of birth
              </label>
              <input
                id="iv-dob"
                name="dob"
                type="date"
                autoComplete="bday"
                className={`${inputClass} ${
                  errors.dateOfBirth ? INPUT_INVALID_CLASS : ""
                } ${form.dateOfBirth ? "text-forest" : "text-forest/50"}`}
                value={form.dateOfBirth}
                onChange={(e) =>
                  setField("dateOfBirth", clampIsoDateInputYear(e.target.value))
                }
                onBlur={() => onBlurKey("dateOfBirth")}
                aria-invalid={!!errors.dateOfBirth}
              />
              {touched.dateOfBirth && errors.dateOfBirth && (
                <p className={errBelowInput} role="alert">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="iv-phone" className={`${labelClass} mb-1.5 block`}>
                Phone
              </label>
              <input
                id="iv-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(555) 123-4567"
                className={`${inputClass} ${errors.phone ? INPUT_INVALID_CLASS : ""}`}
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setField("phone", formatUsPhoneInput(digits));
                }}
                onBlur={() => onBlurKey("phone")}
                aria-invalid={!!errors.phone}
              />
              {touched.phone && errors.phone && (
                <p className={errBelowInput} role="alert">{errors.phone}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="iv-email" className={`${labelClass} mb-1.5 block`}>
                Email
              </label>
              <input
                id="iv-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`${inputClass} ${errors.email ? INPUT_INVALID_CLASS : ""}`}
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                onBlur={() => onBlurKey("email")}
                aria-invalid={!!errors.email}
              />
              {touched.email && errors.email && (
                <p className={errBelowInput} role="alert">{errors.email}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="iv-address" className={`${labelClass} mb-1.5 block`}>
                Address
              </label>
              <AddressAutocomplete
                id="iv-address"
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
                    ? "iv-address-err"
                    : undefined
                }
                onBlur={() => onBlurKey("addressLine1")}
              />
              {touched.addressLine1 && errors.addressLine1 && (
                <p id="iv-address-err" className={errBelowInput} role="alert">
                  {errors.addressLine1}
                </p>
              )}

              <div className="mt-6">
                <label
                  htmlFor="iv-address2"
                  className={`${labelClass} mb-1.5 block`}
                >
                  Address line 2{" "}
                  <span className="font-normal text-forest/70">(optional)</span>
                </label>
                <input
                  id="iv-address2"
                  name="addressLine2"
                  type="text"
                  autoComplete="off"
                  className={inputClass}
                  value={form.addressLine2}
                  onChange={(e) => setField("addressLine2", e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, addressLine2: true }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="my-10 h-px w-full bg-forest/10"
          aria-hidden
        />

        {/* Insurance */}
        <div>
          <h3 className={sectionTitleClass}>Insurance information</h3>
          {usingInsurance ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="iv-carrier" className={`${labelClass} mb-1.5 block`}>
                Insurance provider
              </label>
              <InsurerCombobox
                id="iv-carrier"
                insurers={INSURERS}
                value={form.insuranceProviderId}
                onChange={(id, label) => {
                  setForm((f) => ({
                    ...f,
                    insuranceProviderId: id,
                    insuranceProviderLabel: label,
                    insuranceProviderOtherName:
                      id === "other" ? f.insuranceProviderOtherName : "",
                  }));
                  setTouched((t) => ({ ...t, insuranceProviderId: true }));
                  setErrors((er) => {
                    const n = { ...er };
                    delete n.insuranceProviderId;
                    return n;
                  });
                }}
                error={touched.insuranceProviderId ? errors.insuranceProviderId : undefined}
                invalid={!!errors.insuranceProviderId}
              />

              {form.insuranceProviderId === "other" && !unsupportedInsuranceSelected && (
                <div className="mt-6">
                  <label
                    htmlFor="iv-insurance-provider-other"
                    className={`${labelClass} mb-1.5 block`}
                  >
                    Insurance provider name
                  </label>
                  <input
                    id="iv-insurance-provider-other"
                    name="insuranceProviderOtherName"
                    type="text"
                    autoComplete="off"
                    placeholder="Enter your insurance provider"
                    className={inputClass}
                    value={form.insuranceProviderOtherName}
                    onChange={(e) =>
                      setField("insuranceProviderOtherName", e.target.value)
                    }
                    onBlur={() => onBlurKey("insuranceProviderOtherName")}
                    aria-invalid={!!errors.insuranceProviderOtherName}
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
            {unsupportedInsuranceSelected ? (
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
                    <Link
                      href="/book#book-evaluation"
                      className="mt-3 inline-block text-[13px] font-medium text-darkgreen underline underline-offset-2 hover:text-forest"
                    >
                      Book an evaluation →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
            <div className="sm:col-span-1">
              <LabelWithTip
                htmlFor="iv-member"
                tooltip={{
                  fieldLabel: "Member ID",
                  lines: FIELD_TOOLTIPS.memberId,
                  extraHint: memberIdExtra,
                }}
              >
                Member ID / Subscriber ID
              </LabelWithTip>
              <input
                id="iv-member"
                name="member_id"
                autoComplete="off"
                className={`${inputClass} ${errors.memberId ? INPUT_INVALID_CLASS : ""}`}
                value={form.memberId}
                onChange={(e) => setField("memberId", e.target.value)}
                onBlur={() => onBlurKey("memberId")}
                aria-invalid={!!errors.memberId}
                aria-describedby={
                  touched.memberId && errors.memberId ? "iv-member-err" : undefined
                }
              />
              {touched.memberId && errors.memberId && (
                <p id="iv-member-err" className={errBelowInput} role="alert">
                  {errors.memberId}
                </p>
              )}
            </div>
            <div className="sm:col-span-1">
              <LabelWithTip
                htmlFor="iv-group"
                tooltip={{
                  fieldLabel: "Group number",
                  lines: FIELD_TOOLTIPS.groupNumber,
                }}
              >
                Group number{" "}
                <span className="font-normal text-forest/70">(optional)</span>
              </LabelWithTip>
              <input
                id="iv-group"
                name="group_number"
                autoComplete="off"
                className={inputClass}
                value={form.groupNumber}
                onChange={(e) => setField("groupNumber", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="iv-rel" className={`${labelClass} mb-1.5 block`}>
                Relationship to policyholder
              </label>
              <RelationshipDropdown
                id="iv-rel"
                value={form.relationshipToPolicyholder}
                options={RELATIONSHIP_OPTIONS}
                onChange={(id) => setField("relationshipToPolicyholder", id)}
              />
            </div>

            {form.relationshipToPolicyholder !== "self" && (
              <>
                <div className="sm:col-span-2 rounded-lg border border-forest/[0.07] bg-bone/40 px-4 py-3 text-[14px] text-forest/80">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`${labelClass} !mb-0`}>
                      Policyholder details
                    </span>
                    <FieldTooltip
                      fieldLabel="Policyholder"
                      lines={FIELD_TOOLTIPS.policyholder}
                    />
                  </div>
                  <p className={hintBelowInput}>
                    Add your policy holder details to help us verify your
                    expected cost faster.
                  </p>
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="iv-ph-first" className={`${labelClass} mb-1.5 block`}>
                    Policyholder first name
                  </label>
                  <input
                    id="iv-ph-first"
                    name="policyholder_first_name"
                    autoComplete="off"
                    className={inputClass}
                    value={form.policyholderFirstName}
                    onChange={(e) => setField("policyholderFirstName", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="iv-ph-last" className={`${labelClass} mb-1.5 block`}>
                    Policyholder last name
                  </label>
                  <input
                    id="iv-ph-last"
                    name="policyholder_last_name"
                    autoComplete="off"
                    className={inputClass}
                    value={form.policyholderLastName}
                    onChange={(e) => setField("policyholderLastName", e.target.value)}
                  />
                </div>
                <div className="min-w-0 sm:col-span-2 sm:max-w-xs">
                  <label htmlFor="iv-ph-dob" className={`${labelClass} mb-1.5 block`}>
                    Policyholder date of birth
                  </label>
                  <input
                    id="iv-ph-dob"
                    name="policyholder_dob"
                    type="date"
                    className={`${inputClass} ${DATE_INPUT_SHRINK_CLASS} ${
                      errors.policyholderDateOfBirth ? INPUT_INVALID_CLASS : ""
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
                    aria-invalid={!!errors.policyholderDateOfBirth}
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
          ) : (
            <div className="mt-6 rounded-lg border border-forest/[0.07] bg-bone/40 px-4 py-3 text-[14px] text-forest/80">
              Continuing as out-of-pocket.
            </div>
          )}
        </div>

        <div className="my-10 h-px w-full bg-forest/10" aria-hidden />

        {/* Visit */}
        <div>
          <h3 className={sectionTitleClass}>Visit details</h3>
          <div className="mt-6 min-w-0">
            <div id="iv-availability-heading" className={`${labelClass} !mb-0`}>
              Preferred availability{" "}
              <span className="font-normal text-forest/70">(optional)</span>
            </div>
            <div
              className="mt-3 grid gap-3 sm:grid-cols-2"
              role="group"
              aria-labelledby="iv-availability-heading"
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
            <label htmlFor="iv-scheduling-notes" className={`${labelClass} mb-1.5 block`}>
              Scheduling notes{" "}
              <span className="font-normal text-forest/70">(optional)</span>
            </label>
            <input
              id="iv-scheduling-notes"
              name="scheduling_notes"
              type="text"
              autoComplete="off"
              placeholder="e.g. Tuesdays and Thursdays after 2pm are best"
              className={inputClass}
              value={form.schedulingNotes}
              onChange={(e) => setField("schedulingNotes", e.target.value)}
            />
          </div>

          <div className="my-10 h-px w-full bg-forest/10" aria-hidden />

          <fieldset className="mt-0 min-w-0">
            <legend className={`${labelClass} mb-2 block`}>
              How did you hear about us?{" "}
              <span className="font-normal text-forest/70">(optional)</span>
            </legend>
            <div
              id="iv-hear-about"
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
              <label htmlFor="iv-hear-about-other" className={`${labelClass} mb-1.5 block`}>
                Please share
              </label>
              <input
                id="iv-hear-about-other"
                name="hear_about_other"
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
              {touched.hearAboutOther && errors.hearAboutOther && (
                <p className={errBelowInput} role="alert">
                  {errors.hearAboutOther}
                </p>
              )}
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
              "Check insurance"
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
  );
}
