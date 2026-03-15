import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardSignOut } from "@/components/DashboardSignOut";
import { ElderActions, FamilyMessages, AudioGallery, FamilyConnection, BenefitsCTA, PeaceOfMind } from "./elder-client";

export default async function ElderDashboardPage() {
  const { userId } = await auth();
  const supabase = createAdminClient();
  let messages = [];
  let stories = [];
  let linkedFamilyCount = 0;
  let elderPrefs = null;
  if (userId && supabase) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
    if (profile) {
      const [
        { data: msgData },
        { data: storyData },
        { count: linkedCount },
        { data: prefsData },
      ] = await Promise.all([
        supabase.from("family_messages").select("id, body, created_at").eq("elder_id", profile.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("legacy_stories").select("id, title, created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("parent_id", profile.id),
        supabase.from("elder_preferences").select("emergency_contact_name, emergency_contact_phone, important_papers_note").eq("profile_id", profile.id).maybeSingle(),
      ]);
      messages = msgData ?? [];
      stories = storyData ?? [];
      linkedFamilyCount = linkedCount ?? 0;
      elderPrefs = prefsData ?? null;
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <h1 className="font-serif font-bold text-white" style={{ fontSize: "24px" }}>
            My Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border-2 border-gold bg-transparent px-5 py-3 font-semibold text-gold hover:bg-gold/10"
              style={{ minHeight: "48px", fontSize: "22px" }}
            >
              Home
            </Link>
            <DashboardSignOut variant="elder" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-10">
        <ElderActions />

        <section>
          <FamilyConnection linkedCount={linkedFamilyCount} />
        </section>

        <section>
          <BenefitsCTA />
        </section>

        <section>
          <AudioGallery initialStories={stories} />
        </section>

        <section>
          <PeaceOfMind initialPreferences={elderPrefs} />
        </section>

        <section>
          <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "22px" }}>
            Family Messages
          </h2>
          <FamilyMessages initialMessages={messages} />
        </section>
      </main>
    </div>
  );
}
