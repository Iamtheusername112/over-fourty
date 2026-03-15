"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Returns { profile, hasUser }. hasUser is true when Clerk user is signed in. */
export async function getProfile() {
  try {
    const { userId } = await auth();
    if (!userId) return { profile: null, hasUser: false };

    const supabase = createAdminClient();
    if (!supabase) return { profile: null, hasUser: true };
    const { data } = await supabase.from("profiles").select("*").eq("clerk_user_id", userId).single();
    return { profile: data ?? null, hasUser: true };
  } catch {
    return { profile: null, hasUser: false };
  }
}

export async function completeOnboarding(role) {
  try {
    if (!role || !["OPTIMIZER", "ELDER"].includes(role)) {
      return { ok: false, error: "Invalid role." };
    }
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not signed in." };

    const supabase = createAdminClient();
    if (!supabase) {
      return { ok: false, error: "Server not configured. Add SUPABASE_SERVICE_ROLE_KEY and run clerk-migration.sql in Supabase." };
    }

    const { error } = await supabase.from("profiles").upsert(
      { clerk_user_id: userId, role, onboarding_complete: true, updated_at: new Date().toISOString() },
      { onConflict: "clerk_user_id" }
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    const message = err?.message || String(err);
    return { ok: false, error: message.includes("fetch") ? "Database connection failed. Check SUPABASE_SERVICE_ROLE_KEY and that clerk-migration.sql was run." : message };
  }
}

export async function elderCheckIn() {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found." };

  const { error } = await supabase.from("elder_check_ins").insert({ profile_id: profile.id });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
