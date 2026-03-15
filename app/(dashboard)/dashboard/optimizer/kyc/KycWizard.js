"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck, Home, IdCard, FileText, Building2, CheckCircle } from "lucide-react";
import { saveKycFields, uploadKycDocument, submitKyc } from "@/app/actions/kyc";

const STEPS = [
  { id: 1, label: "Identity", icon: IdCard },
  { id: 2, label: "Address", icon: Home },
  { id: 3, label: "Government ID", icon: IdCard },
  { id: 4, label: "Driver's license", icon: IdCard },
  { id: 5, label: "Utility document", icon: FileText },
  { id: 6, label: "Property", icon: Building2 },
  { id: 7, label: "Review", icon: CheckCircle },
];

const PROPERTY_TYPES = [
  { value: "primary_residence", label: "Primary residence" },
  { value: "investment", label: "Investment property" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
  { value: "other", label: "Other" },
];

export function KycWizard({ initialData }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    full_name: initialData?.full_name ?? "",
    ssn: initialData?.ssn ?? "",
    address_line1: initialData?.address_line1 ?? "",
    address_line2: initialData?.address_line2 ?? "",
    city: initialData?.city ?? "",
    state: initialData?.state ?? "",
    postal_code: initialData?.postal_code ?? "",
    country: initialData?.country ?? "US",
    owns_property: initialData?.owns_property ?? null,
    property_types: initialData?.property_types ?? [],
    government_id_path: initialData?.government_id_path ?? false,
    drivers_license_path: initialData?.drivers_license_path ?? false,
    utility_doc_path: initialData?.utility_doc_path ?? false,
  });

  const [files, setFiles] = useState({ government_id: null, drivers_license: null, utility: null });

  function update(fields) {
    setForm((prev) => ({ ...prev, ...fields }));
    setError("");
  }

  function togglePropertyType(value) {
    setForm((prev) => ({
      ...prev,
      property_types: prev.property_types.includes(value)
        ? prev.property_types.filter((t) => t !== value)
        : [...prev.property_types, value],
    }));
  }

  async function handleSaveAndNext(payload) {
    setSubmitting(true);
    setError("");
    const result = await saveKycFields(payload);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Failed to save.");
      return;
    }
    if (payload.owns_property !== undefined) update({ owns_property: payload.owns_property });
    setStep((s) => Math.min(s + 1, 7));
  }

  async function handleUpload(type, file) {
    if (!file) return;
    setSubmitting(true);
    setError("");
    const fd = new FormData();
    fd.set("type", type);
    fd.set("file", file);
    const result = await uploadKycDocument(fd);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Upload failed.");
      return;
    }
    const pathKey = type === "government_id" ? "government_id_path" : type === "drivers_license" ? "drivers_license_path" : "utility_doc_path";
    update({ [pathKey]: true });
    setFiles((prev) => ({ ...prev, [type === "government_id" ? "government_id" : type === "drivers_license" ? "drivers_license" : "utility"]: null }));
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    const result = await submitKyc();
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error || "Submit failed.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard/optimizer"), 2000);
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border-2 border-gold/50 bg-white p-8 text-center shadow-lg">
        <CheckCircle className="mx-auto h-16 w-16 text-gold" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-navy">KYC submitted</h2>
        <p className="mt-2 text-navy/80">We’ll use this to match you with programs and lenders. You can return to your dashboard.</p>
        <Link href="/dashboard/optimizer" className="mt-6 inline-block rounded border-2 border-gold bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold/90">
          Back to Command Center
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              step === s.id ? "bg-gold text-navy" : "bg-navy/10 text-navy/80 hover:bg-navy/20"
            }`}
          >
            {s.id}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Full name & SSN</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy/80 mb-1">Full legal name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update({ full_name: e.target.value })}
                  className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="As on government ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/80 mb-1">Social Security Number</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.ssn}
                  onChange={(e) => update({ ssn: e.target.value.replace(/\D/g, "").slice(0, 9) })}
                  className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="9 digits, no dashes"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => handleSaveAndNext({ full_name: form.full_name, ssn: form.ssn })}
                disabled={submitting || !form.full_name.trim() || form.ssn.replace(/\D/g, "").length !== 9}
                className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy/80 mb-1">Street address</label>
                <input
                  type="text"
                  value={form.address_line1}
                  onChange={(e) => update({ address_line1: e.target.value })}
                  className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Line 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy/80 mb-1">Apt, suite, etc. (optional)</label>
                <input
                  type="text"
                  value={form.address_line2}
                  onChange={(e) => update({ address_line2: e.target.value })}
                  className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update({ city: e.target.value })}
                    className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => update({ state: e.target.value })}
                    className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    placeholder="e.g. CA"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1">ZIP / Postal code</label>
                  <input
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => update({ postal_code: e.target.value })}
                    className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy/80 mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => update({ country: e.target.value })}
                    className="w-full rounded border border-navy/20 px-4 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="rounded border border-navy/30 px-4 py-2 text-navy hover:bg-navy/10">
                Back
              </button>
              <button
                type="button"
                onClick={() => handleSaveAndNext({
                  address_line1: form.address_line1,
                  address_line2: form.address_line2,
                  city: form.city,
                  state: form.state,
                  postal_code: form.postal_code,
                  country: form.country,
                })}
                disabled={submitting || !form.address_line1.trim() || !form.city.trim() || !form.postal_code.trim()}
                className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Government-issued ID</h2>
            <p className="text-sm text-navy/80 mb-4">Upload a clear photo or scan of your passport, national ID, or state ID.</p>
            {form.government_id_path ? (
              <p className="text-gold font-medium">✓ Document uploaded.</p>
            ) : (
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFiles((prev) => ({ ...prev, government_id: e.target.files?.[0] ?? null }))}
                className="block w-full text-sm text-navy/80 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-navy file:hover:bg-gold/90"
              />
            )}
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="rounded border border-navy/30 px-4 py-2 text-navy hover:bg-navy/10">
                Back
              </button>
              {form.government_id_path ? (
                <button type="button" onClick={() => setStep(4)} className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90">
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => files.government_id && handleUpload("government_id", files.government_id)}
                  disabled={submitting || !files.government_id}
                  className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
                >
                  Upload &amp; continue
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Driver&apos;s license</h2>
            <p className="text-sm text-navy/80 mb-4">Upload front (and back if applicable). Skip if you don’t have one.</p>
            {form.drivers_license_path ? (
              <p className="text-gold font-medium">✓ Document uploaded.</p>
            ) : (
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFiles((prev) => ({ ...prev, drivers_license: e.target.files?.[0] ?? null }))}
                className="block w-full text-sm text-navy/80 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-navy file:hover:bg-gold/90"
              />
            )}
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(3)} className="rounded border border-navy/30 px-4 py-2 text-navy hover:bg-navy/10">
                Back
              </button>
              {form.drivers_license_path ? (
                <button type="button" onClick={() => setStep(5)} className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90">
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => files.drivers_license ? handleUpload("drivers_license", files.drivers_license) : setStep(5)}
                  disabled={submitting && !!files.drivers_license}
                  className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
                >
                  {files.drivers_license ? "Upload & continue" : "Skip"}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Utility or proof of address</h2>
            <p className="text-sm text-navy/80 mb-4">Recent utility bill, bank statement, or official letter (within 90 days) showing your name and address.</p>
            {form.utility_doc_path ? (
              <p className="text-gold font-medium">✓ Document uploaded.</p>
            ) : (
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFiles((prev) => ({ ...prev, utility: e.target.files?.[0] ?? null }))}
                className="block w-full text-sm text-navy/80 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-navy file:hover:bg-gold/90"
              />
            )}
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(4)} className="rounded border border-navy/30 px-4 py-2 text-navy hover:bg-navy/10">
                Back
              </button>
              {form.utility_doc_path ? (
                <button type="button" onClick={() => setStep(6)} className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90">
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => files.utility ? handleUpload("utility", files.utility) : setStep(6)}
                  disabled={submitting && !!files.utility}
                  className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
                >
                  {files.utility ? "Upload & continue" : "Skip"}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Do you own any properties?</h2>
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="owns_property"
                  checked={form.owns_property === true}
                  onChange={() => update({ owns_property: true })}
                  className="rounded-full border-gold text-gold focus:ring-gold"
                />
                <span className="text-navy">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="owns_property"
                  checked={form.owns_property === false}
                  onChange={() => update({ owns_property: false, property_types: [] })}
                  className="rounded-full border-gold text-gold focus:ring-gold"
                />
                <span className="text-navy">No</span>
              </label>
            </div>
            {form.owns_property === true && (
              <div className="mb-6">
                <p className="text-sm font-medium text-navy/80 mb-2">Select all that apply</p>
                <div className="space-y-2">
                  {PROPERTY_TYPES.map((pt) => (
                    <label key={pt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.property_types.includes(pt.value)}
                        onChange={() => togglePropertyType(pt.value)}
                        className="rounded border-gold text-gold focus:ring-gold"
                      />
                      <span className="text-navy">{pt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(5)} className="rounded border border-navy/30 px-4 py-2 text-navy hover:bg-navy/10">
                Back
              </button>
              <button
                type="button"
                onClick={() => handleSaveAndNext({ owns_property: form.owns_property, property_types: form.property_types })}
                disabled={submitting || form.owns_property === null}
                className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div
            key="7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-xl border border-gold/30 bg-white p-6 shadow-md"
          >
            <h2 className="font-serif text-xl font-semibold text-navy mb-4">Review & submit</h2>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-navy/70">Name</dt><dd className="font-medium text-navy">{form.full_name || "—"}</dd></div>
              <div><dt className="text-navy/70">SSN</dt><dd className="font-medium text-navy">{form.ssn ? "•••-" + form.ssn.slice(-4) : "—"}</dd></div>
              <div><dt className="text-navy/70">Address</dt><dd className="font-medium text-navy">{ [form.address_line1, form.address_line2, [form.city, form.state, form.postal_code].filter(Boolean).join(", "), form.country].filter(Boolean).join(", ") || "—" }</dd></div>
              <div><dt className="text-navy/70">Government ID</dt><dd className="font-medium text-navy">{form.government_id_path ? "Uploaded" : "—"}</dd></div>
              <div><dt className="text-navy/70">Driver&apos;s license</dt><dd className="font-medium text-navy">{form.drivers_license_path ? "Uploaded" : "—"}</dd></div>
              <div><dt className="text-navy/70">Utility document</dt><dd className="font-medium text-navy">{form.utility_doc_path ? "Uploaded" : "—"}</dd></div>
              <div><dt className="text-navy/70">Owns property</dt><dd className="font-medium text-navy">{form.owns_property === true ? "Yes" : form.owns_property === false ? "No" : "—"}</dd></div>
              {form.owns_property === true && form.property_types?.length > 0 && (
                <div><dt className="text-navy/70">Property types</dt><dd className="font-medium text-navy">{form.property_types.map((v) => PROPERTY_TYPES.find((p) => p.value === v)?.label || v).join(", ")}</dd></div>
              )}
            </dl>
            <div className="mt-6 flex justify-between">
              <button type="button" onClick={() => setStep(6)} className="rounded border border-navy/30 px-4 py-2 text-navy hover:bg-navy/10">
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded border-2 border-gold bg-gold px-6 py-2 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
              >
                Submit KYC
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
