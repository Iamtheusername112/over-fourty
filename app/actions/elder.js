"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createElderHelpAlert(message) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id, role").eq("clerk_user_id", userId).single();
  if (!profile || profile.role !== "ELDER") return { ok: false, error: "Not authorized." };

  const { error } = await supabase.from("elder_help_alerts").insert({
    profile_id: profile.id,
    message: (message || "").toString().trim().slice(0, 500) || null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getElderPreferences() {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in.", data: null };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured.", data: null };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found.", data: null };

  const { data, error } = await supabase
    .from("elder_preferences")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (error) return { ok: false, error: error.message, data: null };
  return { ok: true, data };
}

export async function saveElderPreferences(payload) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found." };

  const allowed = ["emergency_contact_name", "emergency_contact_phone", "important_papers_note"];
  const updates = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (payload[key] !== undefined) updates[key] = payload[key] ?? null;
  }

  const { error } = await supabase.from("elder_preferences").upsert(
    { profile_id: profile.id, ...updates },
    { onConflict: "profile_id" }
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
