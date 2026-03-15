"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

const BUCKET = "kyc-documents";
const DOC_TYPES = ["government_id", "drivers_license", "utility"];

export async function getKycSubmission() {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in.", data: null };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured.", data: null };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found.", data: null };

  const { data: kyc, error } = await supabase
    .from("kyc_submissions")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (error) return { ok: false, error: error.message, data: null };
  return { ok: true, data: kyc };
}

export async function saveKycFields(payload) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found." };

  const allowed = [
    "full_name", "ssn", "address_line1", "address_line2", "city", "state", "postal_code", "country",
    "owns_property", "property_types", "status",
  ];
  const updates = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (payload[key] !== undefined) {
      if (key === "property_types" && !Array.isArray(payload[key])) updates[key] = payload[key] ? [payload[key]] : [];
      else updates[key] = payload[key];
    }
  }

  const { error } = await supabase
    .from("kyc_submissions")
    .upsert(
      { profile_id: profile.id, ...updates },
      { onConflict: "profile_id" }
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function uploadKycDocument(formData) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found." };

  const type = (formData.get("type") || "").toString();
  if (!DOC_TYPES.includes(type)) return { ok: false, error: "Invalid document type." };

  const file = formData.get("file");
  if (!file || !(file instanceof Blob) || file.size === 0) return { ok: false, error: "No file provided." };

  const ext = file.name?.split(".").pop() || "pdf";
  const safeExt = ["pdf", "jpg", "jpeg", "png"].includes(ext.toLowerCase()) ? ext.toLowerCase() : "pdf";
  const path = `${profile.id}/${type}_${randomUUID()}.${safeExt}`;
  const contentType = file.type || (safeExt === "pdf" ? "application/pdf" : "image/jpeg");

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: true,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const column = type === "government_id" ? "government_id_path" : type === "drivers_license" ? "drivers_license_path" : "utility_doc_path";
  const { data: existing } = await supabase.from("kyc_submissions").select("id").eq("profile_id", profile.id).maybeSingle();

  if (existing) {
    const { error: updateErr } = await supabase.from("kyc_submissions").update({ [column]: path, updated_at: new Date().toISOString() }).eq("profile_id", profile.id);
    if (updateErr) return { ok: false, error: updateErr.message };
  } else {
    const { error: insertErr } = await supabase.from("kyc_submissions").insert({ profile_id: profile.id, [column]: path, updated_at: new Date().toISOString() });
    if (insertErr) return { ok: false, error: insertErr.message };
  }

  return { ok: true, path };
}

export async function submitKyc() {
  return saveKycFields({ status: "submitted" });
}
