"use server";

import { createSupabaseClient } from "@/lib/supabase/client";

export async function submitLead(formData) {
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();

  if (!name || !email) {
    return { ok: false, error: "Name and email are required." };
  }

  const supabase = createSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Database not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." };
  }

  const { error } = await supabase.from("leads").insert({
    name,
    email,
    source: "family_audit_modal",
  });

  if (error) {
    console.error("Lead insert error:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
