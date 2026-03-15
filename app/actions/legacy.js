"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

const BUCKET = "legacy-audio";

export async function createLegacyStory(formData) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in." };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured." };

  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found." };

  const file = formData.get("audio");
  const title = (formData.get("title") || "My Story").toString().trim().slice(0, 200);
  if (!file || !(file instanceof Blob)) return { ok: false, error: "No audio file." };

  // Client sends MP3 (audio/mpeg) when bucket only allows that; otherwise we could accept webm.
  const rawType = (file.type || "").toLowerCase();
  const fileName = file.name || "";
  const isMp3 = rawType === "audio/mpeg" || rawType === "audio/mp3" || fileName.toLowerCase().endsWith(".mp3");
  const ext = isMp3 ? "mp3" : "webm";
  const contentType = isMp3 ? "audio/mpeg" : (rawType.startsWith("audio/webm") ? rawType : "audio/webm");
  const path = `${profile.id}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });
  if (uploadError) {
    const msg = uploadError.message || "";
    if (/mime|content.type|not supported/i.test(msg)) {
      return { ok: false, error: "Storage does not allow this audio format. Ask your administrator to add “audio/webm” to the legacy-audio bucket’s allowed MIME types in Supabase (Storage → legacy-audio → Configuration)." };
    }
    return { ok: false, error: uploadError.message };
  }

  const { data: row, error: insertError } = await supabase
    .from("legacy_stories")
    .insert({
      profile_id: profile.id,
      title: title || "My Story",
      storage_path: path,
    })
    .select("id")
    .single();
  if (insertError) return { ok: false, error: insertError.message };

  return { ok: true, id: row.id };
}

export async function getLegacyStoryPlaybackUrl(storyId) {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in.", url: null };

  const supabase = createAdminClient();
  if (!supabase) return { ok: false, error: "Not configured.", url: null };

  const { data: story } = await supabase.from("legacy_stories").select("storage_path, profile_id").eq("id", storyId).single();
  if (!story) return { ok: false, error: "Story not found.", url: null };

  const { data: profile } = await supabase.from("profiles").select("id, parent_id").eq("clerk_user_id", userId).single();
  if (!profile) return { ok: false, error: "Profile not found.", url: null };

  const isElderOwner = story.profile_id === profile.id;
  const isOptimizerLinked = profile.parent_id === story.profile_id;
  if (!isElderOwner && !isOptimizerLinked) return { ok: false, error: "Not allowed.", url: null };

  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(story.storage_path, 3600);
  if (!signed?.signedUrl) return { ok: false, error: "Could not create playback URL.", url: null };
  return { ok: true, url: signed.signedUrl };
}
