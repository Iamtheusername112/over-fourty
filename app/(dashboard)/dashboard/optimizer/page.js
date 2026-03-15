import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BarChart3,
  Heart,
  Brain,
  Check,
  CircleAlert,
} from "lucide-react";
import { SubscriptionGate } from "@/components/SubscriptionGate";
import { ParentalGuardianCard } from "./ParentalGuardianCard";
import WealthAcceleratorWrapper from "./WealthAcceleratorWrapper";

export default async function OptimizerDashboardPage() {
  const { userId } = await auth();
  const supabase = createAdminClient();
  const { data: profile } = userId && supabase
    ? await supabase.from("profiles").select("id, parent_id, subscription_tier, subscription_status").eq("clerk_user_id", userId).single()
    : { data: null };

  const subscriptionTier = profile?.subscription_tier ?? "FREE";
  const subscriptionStatus = profile?.subscription_status ?? "inactive";

  let elderStatus = null;
  let latestStory = null;
  if (supabase && profile?.parent_id) {
    const [{ data: elder }, { data: story }] = await Promise.all([
      supabase.from("profiles").select("last_seen").eq("id", profile.parent_id).single(),
      supabase.from("legacy_stories").select("id, title").eq("profile_id", profile.parent_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    elderStatus = elder ?? null;
    latestStory = story ?? null;
  }

  return (
    <div className="min-h-screen bg-bg-off-white">
      <header className="border-b border-navy/10 bg-navy px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-white">Command Center</h1>
          <Link
            href="/"
            className="rounded border border-gold bg-transparent px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Module A: Vitality Metrics */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">Vitality Metrics</h2>
          <SubscriptionGate subscriptionTier={subscriptionTier} subscriptionStatus={subscriptionStatus} className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
              <div className="flex items-center gap-2 text-gold">
                <Heart className="h-6 w-6" />
                <span className="font-serif text-lg font-semibold text-navy">Biological Age</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-navy">42</span>
                <span className="text-sm text-navy/70">vs chronological 48</span>
              </div>
              <p className="mt-2 text-sm text-navy/80">6 years younger. Keep it up.</p>
            </div>
            <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
              <div className="flex items-center gap-2 text-gold">
                <BarChart3 className="h-6 w-6" />
                <span className="font-serif text-lg font-semibold text-navy">Stress Recovery (HRV)</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gold">72</span>
                <span className="text-sm text-navy/70">ms RMSSD</span>
              </div>
              <p className="mt-2 text-sm text-navy/80">Good recovery this week.</p>
            </div>
            <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
              <div className="flex items-center gap-2 text-gold">
                <Brain className="h-6 w-6" />
                <span className="font-serif text-lg font-semibold text-navy">Cognitive Focus</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-navy">8.2</span>
                <span className="text-sm text-navy/70">/ 10</span>
              </div>
              <p className="mt-2 text-sm text-navy/80">Peak hours: 9–11 AM.</p>
            </div>
          </SubscriptionGate>
        </section>

        {/* The Wealth Accelerator */}
        <SubscriptionGate subscriptionTier={subscriptionTier} subscriptionStatus={subscriptionStatus}>
          <WealthAcceleratorWrapper />
        </SubscriptionGate>

        {/* Module B: Parental Guardian */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">Parental Guardian</h2>
          <SubscriptionGate subscriptionTier={subscriptionTier} subscriptionStatus={subscriptionStatus}>
            <ParentalGuardianCard elderStatus={elderStatus} latestStory={latestStory} hasLinkedElder={!!profile?.parent_id} />
          </SubscriptionGate>
        </section>

        {/* KYC — Access funds & loans */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">Access funds & loans</h2>
          <SubscriptionGate subscriptionTier={subscriptionTier} subscriptionStatus={subscriptionStatus}>
            <Link
              href="/dashboard/optimizer/kyc"
              className="block rounded-xl border-2 border-gold bg-gold/10 p-6 shadow-md transition hover:bg-gold/20 hover:border-gold"
            >
              <p className="font-serif text-lg font-semibold text-navy">Get very easy with our help</p>
              <p className="mt-2 text-sm text-navy/80">
                Complete verification so we can connect you with government programs and major financial institutions for loans and funds.
              </p>
              <span className="mt-4 inline-block rounded border-2 border-gold bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold/90 transition">
                Start KYC →
              </span>
            </Link>
          </SubscriptionGate>
        </section>

        {/* Module C: Family Wealth / Legal */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-navy mb-6">Family Wealth & Legal</h2>
          <SubscriptionGate subscriptionTier={subscriptionTier} subscriptionStatus={subscriptionStatus}>
            <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-navy">
                  <Check className="h-5 w-5 shrink-0 text-gold" />
                  <span className="font-medium">Will & testament on file</span>
                </li>
                <li className="flex items-center gap-3 text-navy/70">
                  <CircleAlert className="h-5 w-5 shrink-0 text-amber-500" />
                  <span>Estate plan status: <strong>Incomplete</strong></span>
                </li>
                <li className="flex items-center gap-3 text-navy/70">
                  <CircleAlert className="h-5 w-5 shrink-0 text-amber-500" />
                  <span>Medical directives: <strong>Not uploaded</strong></span>
                </li>
                <li className="flex items-center gap-3 text-navy">
                  <Check className="h-5 w-5 shrink-0 text-gold" />
                  <span className="font-medium">Power of attorney designated</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-navy/70">Complete missing items in your family organization.</p>
            </div>
          </SubscriptionGate>
        </section>
      </main>
    </div>
  );
}
