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
    if (error) {
      const msg = error.message || "";
      if (msg.toLowerCase().includes("invalid") && msg.toLowerCase().includes("key")) {
        return { ok: false, error: "Invalid Supabase key. In .env.local set SUPABASE_SERVICE_ROLE_KEY from Supabase Dashboard → Project Settings → API → service_role (secret)." };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err?.message || String(err);
    if (message.toLowerCase().includes("invalid") && message.toLowerCase().includes("key")) {
      return { ok: false, error: "Invalid Supabase key. Set SUPABASE_SERVICE_ROLE_KEY in .env.local from Supabase Dashboard → Project Settings → API → service_role." };
    }
    return { ok: false, error: message.includes("fetch") ? "Database connection failed. Check SUPABASE_SERVICE_ROLE_KEY and that clerk-migration.sql was run." : message };
  }
}

/** Generate a short unique invite code (e.g. for Parent link). */
function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/** Step 1: Set role. Step 2 (Optimizer): ensure invite_code exists. Called from /onboarding/setup. */
export async function saveSetupRole(role) {
  try {
    if (!role || !["OPTIMIZER", "ELDER"].includes(role)) return { ok: false, error: "Invalid role." };
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not signed in." };

    const supabase = createAdminClient();
    if (!supabase) return { ok: false, error: "Server not configured." };

    const { data: existing } = await supabase.from("profiles").select("id, invite_code").eq("clerk_user_id", userId).single();
    const updates = { role, onboarding_step: role === "OPTIMIZER" ? "invite" : "audit", updated_at: new Date().toISOString() };
    if (role === "OPTIMIZER" && !existing?.invite_code) {
      let code = generateInviteCode();
      let attempts = 0;
      while (attempts < 5) {
        const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("invite_code", code);
        if (count === 0) break;
        code = generateInviteCode();
        attempts++;
      }
      updates.invite_code = code;
    }
    const { error } = existing
      ? await supabase.from("profiles").update(updates).eq("clerk_user_id", userId)
      : await supabase.from("profiles").upsert({ clerk_user_id: userId, role, onboarding_complete: false, ...updates }, { onConflict: "clerk_user_id" });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || "Failed to save." };
  }
}

/** Step 3: Mark audit complete and finish onboarding. */
export async function completeSetupAudit() {
  try {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not signed in." };

    const supabase = createAdminClient();
    if (!supabase) return { ok: false, error: "Server not configured." };

    const { data: profile } = await supabase.from("profiles").select("id, role").eq("clerk_user_id", userId).single();
    if (!profile) return { ok: false, error: "Profile not found." };

    const { error } = await supabase
      .from("profiles")
      .update({ audit_completed: true, onboarding_complete: true, onboarding_step: null, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true, role: profile.role };
  } catch (err) {
    return { ok: false, error: err?.message || "Failed." };
  }
}

export async function elderCheckIn() {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found." };

  const now = new Date().toISOString();
  const { error: updateError } = await supabase.from("profiles").update({ last_seen: now, updated_at: now }).eq("id", profile.id);
  if (updateError) return { ok: false, error: updateError.message };

  const { error } = await supabase.from("elder_check_ins").insert({ profile_id: profile.id });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
