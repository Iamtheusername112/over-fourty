import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ElderActions, FamilyMessages } from "./elder-client";

export default async function ElderDashboardPage() {
  const { userId } = await auth();
  const supabase = createAdminClient();
  let messages = [];
  if (userId && supabase) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
    if (profile) {
      const { data } = await supabase.from("family_messages").select("id, body, created_at").eq("elder_id", profile.id).order("created_at", { ascending: false }).limit(10);
      messages = data ?? [];
    }
  }

  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-white" style={{ fontSize: "24px" }}>
            My Dashboard
          </h1>
          <Link
            href="/"
            className="rounded-lg border-2 border-gold bg-transparent px-5 py-3 text-lg font-semibold text-gold hover:bg-gold/10"
            style={{ minHeight: "48px" }}
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <ElderActions />
        <section className="mt-10">
          <h2 className="font-serif text-xl font-bold text-white mb-4" style={{ fontSize: "24px" }}>
            Family Messages
          </h2>
          <FamilyMessages initialMessages={messages} />
        </section>
      </main>
    </div>
  );
}
