"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, Share2, FileCheck } from "lucide-react";
import { getProfile, saveSetupRole, completeSetupAudit } from "@/app/actions/profile";
import { InviteParentCard } from "./InviteParentCard";

const STEP_ROLE = 1;
const STEP_INVITE = 2;
const STEP_AUDIT = 3;

export default function OnboardingSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(STEP_ROLE);
  const [profile, setProfile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { profile: p, hasUser } = await getProfile();
      if (!hasUser) {
        router.replace("/sign-in");
        return;
      }
      setProfile(p);
      if (p?.onboarding_complete) {
        router.replace(p.role === "ELDER" ? "/dashboard/elder" : "/dashboard/optimizer");
        return;
      }
      if (p?.onboarding_step === "invite" && p?.role === "OPTIMIZER") setStep(STEP_INVITE);
      else if (p?.onboarding_step === "audit" || p?.role === "ELDER") setStep(STEP_AUDIT);
      setLoading(false);
    })();
  }, [router]);

  async function handleRoleSelect(role) {
    setSubmitting(true);
    setError("");
    const result = await saveSetupRole(role);
    setSubmitting(false);
    if (!result?.ok) {
      setError(result?.error || "Something went wrong.");
      return;
    }
    if (role === "OPTIMIZER") {
      const { profile: updated } = await getProfile();
      setProfile(updated || null);
      setStep(STEP_INVITE);
    } else {
      setStep(STEP_AUDIT);
      setProfile((prev) => (prev ? { ...prev, role, onboarding_step: "audit" } : prev));
    }
  }

  function handleInviteNext() {
    setStep(STEP_AUDIT);
    setProfile((prev) => (prev ? { ...prev, onboarding_step: "audit" } : prev));
  }

  async function handleAuditComplete() {
    setSubmitting(true);
    setError("");
    const result = await completeSetupAudit();
    setSubmitting(false);
    if (!result?.ok) {
      setError(result?.error || "Something went wrong.");
      return;
    }
    router.replace(result.role === "ELDER" ? "/dashboard/elder" : "/dashboard/optimizer");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <p className="text-white/80">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <header className="border-b border-white/10 py-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Aegis" width={40} height={40} className="object-contain" />
          <span className="font-serif font-semibold text-white">AEGIS</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {[STEP_ROLE, STEP_INVITE, STEP_AUDIT].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full transition-colors ${step >= s ? "bg-gold" : "bg-white/20"}`}
                aria-hidden
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Role */}
            {step === STEP_ROLE && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="rounded-lg border-2 border-gold bg-navy/95 p-8 shadow-xl"
              >
                <h1 className="font-serif text-2xl font-bold text-white text-center">
                  Are you the Family Optimizer (Age 40–60) or the Family Elder (Age 75+)?
                </h1>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("OPTIMIZER")}
                    disabled={submitting}
                    className="flex flex-col items-center gap-3 rounded-lg border-2 border-gold/50 bg-white/5 p-6 text-white transition hover:border-gold hover:bg-white/10 disabled:opacity-50"
                  >
                    <Users className="h-12 w-12 text-gold" />
                    <span className="font-serif font-semibold">Family Optimizer</span>
                    <span className="text-center text-sm text-white/70">Track vitality, monitor family, organize estate.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("ELDER")}
                    disabled={submitting}
                    className="flex flex-col items-center gap-3 rounded-lg border-2 border-gold/50 bg-white/5 p-6 text-white transition hover:border-gold hover:bg-white/10 disabled:opacity-50"
                  >
                    <User className="h-12 w-12 text-gold" />
                    <span className="font-serif font-semibold">Family Elder</span>
                    <span className="text-center text-sm text-white/70">Record your story, daily check-in, stay connected.</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Invite (Optimizer only) */}
            {step === STEP_INVITE && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
              >
                <InviteParentCard profile={profile} onNext={handleInviteNext} />
              </motion.div>
            )}

            {/* Step 3: Audit */}
            {step === STEP_AUDIT && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="rounded-lg border-2 border-gold bg-navy/95 p-8 shadow-xl"
              >
                <div className="flex justify-center text-gold">
                  <FileCheck className="h-12 w-12" />
                </div>
                <h1 className="mt-4 font-serif text-2xl font-bold text-white text-center">
                  Initial Audit
                </h1>
                <p className="mt-2 text-center text-white/80">
                  Complete the Family Audit to generate your baseline Longevity Score. You can do a quick version now and refine later.
                </p>
                <div className="mt-6 rounded-lg border border-gold/30 bg-white/5 p-4 text-white/90">
                  <p className="text-sm">Placeholder: In a full build, an inline quiz or link to the audit would appear here. For now, mark complete to continue.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAuditComplete}
                  disabled={submitting}
                  className="mt-8 w-full rounded-lg border-2 border-gold bg-gold py-3 font-semibold text-navy hover:bg-gold/90 disabled:opacity-50"
                >
                  {submitting ? "Saving…" : "Complete & go to Dashboard"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
        </div>
      </main>
    </div>
  );
}
