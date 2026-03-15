"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getProfile() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export async function completeOnboarding(role) {
  if (!role || !["OPTIMIZER", "ELDER"].includes(role)) {
    return { ok: false, error: "Invalid role." };
  }
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Not configured." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase.from("profiles").upsert(
    { id: user.id, role, onboarding_complete: true, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function elderCheckIn() {
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Not configured." };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { error } = await supabase.from("elder_check_ins").insert({
    profile_id: user.id,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
