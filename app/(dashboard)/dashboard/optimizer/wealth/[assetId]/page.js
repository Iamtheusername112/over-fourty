import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Building2, Shield, Zap } from "lucide-react";
import { AssetGuideContent } from "./AssetGuideContent";

const ASSETS = {
  institutional: {
    title: "Institutional Yield",
    subtitle: "Real estate & private credit funds",
    icon: Building2,
  },
  generational: {
    title: "Generational Transfer",
    subtitle: "Insurance & tax-efficient planning",
    icon: Shield,
  },
  growth: {
    title: "High-Growth Equities",
    subtitle: "Leveraged accumulation strategies",
    icon: Zap,
  },
};

const PAID_TIERS = ["ACCESS", "FAMILY_SHIELD", "ELDER_ADVOCACY"];

export default async function WealthAssetPage({ params }) {
  const { assetId } = await params;
  const asset = ASSETS[assetId];
  if (!asset) redirect("/dashboard/optimizer");

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = createAdminClient();
  if (!supabase) redirect("/sign-in");
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status")
    .eq("clerk_user_id", userId)
    .single();

  const tier = profile?.subscription_tier ?? "FREE";
  const status = profile?.subscription_status ?? "inactive";
  const isPaid = PAID_TIERS.includes(tier) || status === "active";

  return (
    <div className="min-h-screen bg-bg-off-white">
      <header className="border-b border-navy/10 bg-navy px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard/optimizer" className="text-sm font-medium text-gold hover:text-gold/80">
            ← Back to Command Center
          </Link>
          <Link href="/dashboard/optimizer" className="rounded border border-gold bg-transparent px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {!isPaid ? (
          <div className="rounded-xl border-2 border-gold/50 bg-white p-8 shadow-lg text-center">
            <h1 className="font-serif text-2xl font-bold text-navy mb-2">Subscriber-only guide</h1>
            <p className="text-navy/80 mb-6">
              This guide is available to Family Shield and Advocacy members. Subscribe to unlock full access to strategic asset insights and how to build reach from each pillar.
            </p>
            <Link
              href="/billing"
              className="inline-block rounded border-2 border-gold bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold/90"
            >
              Subscribe to view
            </Link>
          </div>
        ) : (
          <AssetGuideContent assetId={assetId} title={asset.title} subtitle={asset.subtitle} />
        )}
      </main>
    </div>
  );
}
