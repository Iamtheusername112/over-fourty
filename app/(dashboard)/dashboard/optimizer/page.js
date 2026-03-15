import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarChart3, Shield, FileCheck } from "lucide-react";

export default async function OptimizerDashboardPage() {
  const { userId } = await auth();
  const supabase = createAdminClient();
  const { data: profile } = userId && supabase
    ? await supabase.from("profiles").select("id, parent_id").eq("clerk_user_id", userId).single()
    : { data: null };

  return (
    <div className="min-h-screen bg-bg-off-white">
      <header className="border-b border-navy/10 bg-navy px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-white">Optimizer Dashboard</h1>
          <Link
            href="/"
            className="rounded border border-gold bg-transparent px-4 py-2 text-sm font-medium text-gold hover:bg-gold/10"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* My Vitality */}
          <section className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
            <div className="flex items-center gap-2 text-gold">
              <BarChart3 className="h-6 w-6" />
              <h2 className="font-serif text-lg font-semibold text-navy">My Vitality</h2>
            </div>
            <div className="mt-4 space-y-4">
              <div className="h-20 rounded bg-bg-off-white flex items-end justify-around p-2">
                <div className="w-12 rounded bg-gold/40" style={{ height: "40%" }} title="Cortisol" />
                <div className="w-12 rounded bg-gold/40" style={{ height: "70%" }} title="Sleep" />
                <div className="w-12 rounded bg-gold/40" style={{ height: "55%" }} title="HRV" />
              </div>
              <p className="text-xs text-navy/70">Cortisol · Sleep · HRV (dummy data)</p>
            </div>
          </section>

          {/* Parental Shield */}
          <section className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
            <div className="flex items-center gap-2 text-gold">
              <Shield className="h-6 w-6" />
              <h2 className="font-serif text-lg font-semibold text-navy">Parental Shield</h2>
            </div>
            <div className="mt-4 space-y-2 text-navy/90">
              {profile?.parent_id ? (
                <>
                  <p className="text-sm">Linked Elder profile</p>
                  <p className="text-xs text-navy/70">Last check-in: —</p>
                  <p className="text-xs text-navy/70">Latest Legacy Story: —</p>
                </>
              ) : (
                <p className="text-sm">No linked Elder yet. Link a parent in settings.</p>
              )}
            </div>
          </section>

          {/* Audit Results */}
          <section className="rounded-lg border border-gold/30 bg-white p-6 shadow-md md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-gold">
              <FileCheck className="h-6 w-6" />
              <h2 className="font-serif text-lg font-semibold text-navy">Audit Results</h2>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gold">Longevity Gap</p>
              <p className="text-sm text-navy/70">Complete the quiz to see your score.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
