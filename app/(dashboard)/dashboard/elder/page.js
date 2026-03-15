import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ElderActions, FamilyMessages, AudioGallery } from "./elder-client";

export default async function ElderDashboardPage() {
  const { userId } = await auth();
  const supabase = createAdminClient();
  let messages = [];
  let stories = [];
  if (userId && supabase) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
    if (profile) {
      const [{ data: msgData }, { data: storyData }] = await Promise.all([
        supabase.from("family_messages").select("id, body, created_at").eq("elder_id", profile.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("legacy_stories").select("id, title, created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(20),
      ]);
      messages = msgData ?? [];
      stories = storyData ?? [];
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="font-serif font-bold text-white" style={{ fontSize: "24px" }}>
            My Dashboard
          </h1>
          <Link
            href="/"
            className="rounded-lg border-2 border-gold bg-transparent px-5 py-3 font-semibold text-gold hover:bg-gold/10"
            style={{ minHeight: "48px", fontSize: "22px" }}
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <ElderActions />
        <section className="mt-10">
          <AudioGallery initialStories={stories} />
        </section>
        <section className="mt-10">
          <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "22px" }}>
            Family Messages
          </h2>
          <FamilyMessages initialMessages={messages} />
        </section>
      </main>
    </div>
  );
}
