"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { completeOnboarding, getProfile } from "@/app/actions/profile";
import { User, Users } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { profile, hasUser } = await getProfile();
      if (!hasUser) {
        router.replace("/sign-in");
        return;
      }
      if (profile?.onboarding_complete) {
        router.replace(profile.role === "ELDER" ? "/dashboard/elder" : "/dashboard/optimizer");
        return;
      }
      if (profile?.subscription_status === "active" && profile?.onboarding_step) {
        router.replace("/onboarding/setup");
        return;
      }
      setLoading(false);
    })();
  }, [router]);

  async function handleRoleSelect(role) {
    setSubmitting(true);
    setError("");
    try {
      const result = await completeOnboarding(role);
      setSubmitting(false);
      if (!result?.ok) {
        setError(result?.error || "Something went wrong.");
        return;
      }
      router.replace(role === "ELDER" ? "/dashboard/elder" : "/dashboard/optimizer");
    } catch (err) {
      setSubmitting(false);
      setError(err?.message?.includes("fetch") ? "Request failed. Check that SUPABASE_SERVICE_ROLE_KEY is set and clerk-migration.sql was run in Supabase." : (err?.message || "Something went wrong."));
    }
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
        <div className="w-full max-w-lg rounded-lg border-2 border-gold bg-navy/95 p-8 shadow-xl">
          <h1 className="font-serif text-2xl font-bold text-white text-center">
            Choose your role
          </h1>
          <p className="mt-2 text-center text-white/80 text-sm">
            How will you use Aegis? This can be updated later.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleRoleSelect("OPTIMIZER")}
              disabled={submitting}
              className="flex flex-col items-center gap-3 rounded-lg border-2 border-gold/50 bg-white/5 p-6 text-white transition hover:border-gold hover:bg-white/10 disabled:opacity-50"
            >
              <Users className="h-12 w-12 text-gold" />
              <span className="font-serif font-semibold">OPTIMIZER</span>
              <span className="text-center text-sm text-white/70">
                Track your vitality and monitor your family.
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect("ELDER")}
              disabled={submitting}
              className="flex flex-col items-center gap-3 rounded-lg border-2 border-gold/50 bg-white/5 p-6 text-white transition hover:border-gold hover:bg-white/10 disabled:opacity-50"
            >
              <User className="h-12 w-12 text-gold" />
              <span className="font-serif font-semibold">ELDER</span>
              <span className="text-center text-sm text-white/70">
                Record your story and stay connected with family.
              </span>
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
          )}
        </div>
      </main>
    </div>
  );
}
