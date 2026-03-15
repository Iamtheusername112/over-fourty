"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mic, ThumbsUp, Loader2, AlertCircle, Heart, FileText, Users } from "lucide-react";
import { elderCheckIn } from "@/app/actions/profile";
import { createLegacyStory, getLegacyStoryPlaybackUrl } from "@/app/actions/legacy";
import { webmBlobToMp3 } from "@/lib/audio/webmToMp3";
import { createElderHelpAlert } from "@/app/actions/elder";
import { getElderPreferences, saveElderPreferences } from "@/app/actions/elder";

export function ElderActions() {
  const router = useRouter();
  const [checkInStatus, setCheckInStatus] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState("");
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function handleCheckIn() {
    setCheckInStatus("…");
    const result = await elderCheckIn();
    setCheckInStatus(result.ok ? "Thank you. We’ve recorded that you’re doing well today." : (result.error || "Try again."));
  }

  function startRecording() {
    setRecordError("");
    chunksRef.current = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const webmBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setUploading(true);
        setRecordError("");
        try {
          const mp3Blob = await webmBlobToMp3(webmBlob);
          const form = new FormData();
          form.append("audio", mp3Blob, "recording.mp3");
          form.append("title", "My Story");
          const result = await createLegacyStory(form);
          if (result?.ok) {
            router.refresh();
          } else {
            setRecordError(result?.error || "Upload failed.");
          }
        } catch (err) {
          setRecordError(err?.message || "Could not process or upload recording.");
        } finally {
          setUploading(false);
          setRecording(false);
        }
      };
      mr.start();
      setRecording(true);
    }).catch(() => {
      setRecordError("Microphone access is needed to record.");
      setRecording(false);
    });
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  return (
    <div className="space-y-6">
      {/* Module A: Legacy Recording */}
      <div>
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          disabled={uploading}
          className="w-full rounded-xl border-2 border-gold bg-gold py-6 text-navy shadow-lg transition hover:bg-gold/90 disabled:opacity-70"
          style={{ fontSize: "22px", minHeight: "80px", fontWeight: 700 }}
        >
          <span className="flex items-center justify-center gap-3">
            {uploading ? <Loader2 className="h-8 w-8 animate-spin" aria-hidden /> : <Mic className="h-8 w-8" aria-hidden />}
            {uploading ? "Saving…" : recording ? "STOP RECORDING" : "START RECORDING MY STORY"}
          </span>
        </button>
        {recordError && <p className="mt-2 text-lg text-red-300" style={{ fontSize: "20px" }}>{recordError}</p>}
      </div>

      {/* Module B: Simple Check-in */}
      <div className="rounded-xl border-2 border-white/20 bg-white/5 p-6">
        <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "22px" }}>
          Daily Check-in
        </h2>
        <button
          type="button"
          onClick={handleCheckIn}
          className="w-full rounded-xl border-2 border-navy bg-navy py-4 font-semibold text-white hover:bg-navy/90"
          style={{ fontSize: "22px", minHeight: "56px" }}
        >
          <span className="flex items-center justify-center gap-2">
            <ThumbsUp className="h-7 w-7" aria-hidden />
            I AM DOING WELL TODAY
          </span>
        </button>
        {checkInStatus && (
          <p className="mt-3 text-gold" style={{ fontSize: "20px" }}>
            {checkInStatus}
          </p>
        )}
      </div>

      {/* I need help */}
      <div className="rounded-xl border-2 border-white/20 bg-white/5 p-6">
        <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: "22px" }}>
          Need help?
        </h2>
        <p className="text-white/90 mb-4" style={{ fontSize: "20px" }}>
          Tap below and your family will be notified right away.
        </p>
        <NeedHelpButton />
      </div>
    </div>
  );
}

function NeedHelpButton() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setStatus("");
    const result = await createElderHelpAlert("I need help");
    setLoading(false);
    setStatus(result?.ok ? "Help requested. Your family has been notified." : (result?.error || "Please try again."));
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-xl border-2 border-amber-400 bg-amber-500 py-4 font-semibold text-navy hover:bg-amber-400 disabled:opacity-70"
        style={{ fontSize: "22px", minHeight: "56px" }}
      >
        <span className="flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-7 w-7 animate-spin" aria-hidden /> : <AlertCircle className="h-7 w-7" aria-hidden />}
          I NEED HELP
        </span>
      </button>
      {status && (
        <p className={`mt-3 ${status.includes("notified") ? "text-gold" : "text-red-300"}`} style={{ fontSize: "20px" }}>
          {status}
        </p>
      )}
    </>
  );
}

export function FamilyConnection({ linkedCount = 0 }) {
  return (
    <div className="rounded-xl border-2 border-gold/30 bg-white/5 p-6">
      <h2 className="font-serif font-bold text-white mb-4 flex items-center gap-2" style={{ fontSize: "22px" }}>
        <Users className="h-7 w-7 text-gold" aria-hidden />
        Your family
      </h2>
      {linkedCount > 0 ? (
        <p className="text-white" style={{ fontSize: "22px" }}>
          Your family member is connected. They can see when you check in and listen to your recordings.
        </p>
      ) : (
        <p className="text-white/90" style={{ fontSize: "22px" }}>
          Ask your family to connect with you using their invite code from their dashboard. Once they add you, you’ll see it here.
        </p>
      )}
    </div>
  );
}

export function BenefitsCTA() {
  return (
    <Link
      href="/dashboard/elder/benefits"
      className="block rounded-xl border-2 border-gold bg-gold/10 p-6 transition hover:bg-gold/20 hover:border-gold"
    >
      <h2 className="font-serif font-bold text-white mb-2 flex items-center gap-2" style={{ fontSize: "22px" }}>
        <Heart className="h-7 w-7 text-gold" aria-hidden />
        Get benefits with our help
      </h2>
      <p className="text-white/90" style={{ fontSize: "20px" }}>
        Connect to government and community programs: Medicare, Social Security, housing, and prescriptions.
      </p>
      <span className="mt-4 inline-block rounded-lg border-2 border-gold bg-gold px-5 py-2 font-semibold text-navy hover:bg-gold/90" style={{ fontSize: "20px" }}>
        See programs →
      </span>
    </Link>
  );
}

export function PeaceOfMind({ initialPreferences = null }) {
  const [prefs, setPrefs] = useState(() => ({
    emergency_contact_name: initialPreferences?.emergency_contact_name ?? "",
    emergency_contact_phone: initialPreferences?.emergency_contact_phone ?? "",
    important_papers_note: initialPreferences?.important_papers_note ?? "",
  }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const result = await saveElderPreferences(prefs);
    setSaving(false);
    setMessage(result?.ok ? "Saved." : (result?.error || "Could not save."));
  }

  return (
    <div className="rounded-xl border-2 border-white/20 bg-white/5 p-6">
      <h2 className="font-serif font-bold text-white mb-4 flex items-center gap-2" style={{ fontSize: "22px" }}>
        <FileText className="h-7 w-7 text-gold" aria-hidden />
        Peace of mind
      </h2>
      <p className="text-white/90 mb-4" style={{ fontSize: "20px" }}>
        Optional: who to call in an emergency, and where you keep important papers.
      </p>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-white/80 mb-1" style={{ fontSize: "20px" }}>Emergency contact name</label>
          <input
            type="text"
            value={prefs.emergency_contact_name || ""}
            onChange={(e) => setPrefs((p) => ({ ...p, emergency_contact_name: e.target.value }))}
            className="w-full rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none"
            style={{ fontSize: "20px" }}
            placeholder="Name"
          />
        </div>
        <div>
          <label className="block text-white/80 mb-1" style={{ fontSize: "20px" }}>Emergency contact phone</label>
          <input
            type="tel"
            value={prefs.emergency_contact_phone || ""}
            onChange={(e) => setPrefs((p) => ({ ...p, emergency_contact_phone: e.target.value }))}
            className="w-full rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none"
            style={{ fontSize: "20px" }}
            placeholder="Phone"
          />
        </div>
        <div>
          <label className="block text-white/80 mb-1" style={{ fontSize: "20px" }}>Where are my important papers?</label>
          <textarea
            value={prefs.important_papers_note || ""}
            onChange={(e) => setPrefs((p) => ({ ...p, important_papers_note: e.target.value }))}
            className="w-full rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-gold focus:outline-none resize-y min-h-[80px]"
            style={{ fontSize: "20px" }}
            placeholder="e.g. In the safe, with my lawyer"
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl border-2 border-gold bg-gold py-3 px-6 font-semibold text-navy hover:bg-gold/90 disabled:opacity-70"
          style={{ fontSize: "22px" }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
      {message && <p className="mt-3 text-gold" style={{ fontSize: "20px" }}>{message}</p>}
    </div>
  );
}

export function FamilyMessages({ initialMessages = [] }) {
  return (
    <ul className="space-y-4">
      {initialMessages.length === 0 ? (
        <li className="rounded-xl border-2 border-white/10 bg-white/5 p-5 text-white/80" style={{ fontSize: "22px" }}>
          No messages yet. Your family can send you notes here.
        </li>
      ) : (
        initialMessages.map((msg, i) => (
          <li
            key={msg.id ?? i}
            className="rounded-xl border-2 border-gold/30 bg-white/5 p-5 text-white"
            style={{ fontSize: "22px" }}
          >
            <p>{msg.body}</p>
            <p className="mt-2 text-sm text-white/60">
              {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ""}
            </p>
          </li>
        ))
      )}
    </ul>
  );
}

export function AudioGallery({ initialStories = [] }) {
  const [stories, setStories] = useState(initialStories);
  const [playingId, setPlayingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const audioRef = useRef(null);

  async function playStory(id) {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    setLoadingId(id);
    const result = await getLegacyStoryPlaybackUrl(id);
    setLoadingId(null);
    if (!result?.ok || !result.url) {
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = result.url;
    audioRef.current.onended = () => setPlayingId(null);
    audioRef.current.play();
    setPlayingId(id);
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif font-bold text-white" style={{ fontSize: "22px" }}>
        Your Recordings
      </h2>
      <audio ref={audioRef} />
      {stories.length === 0 ? (
        <p className="rounded-xl border-2 border-white/10 bg-white/5 p-5 text-white/80" style={{ fontSize: "22px" }}>
          No recordings yet. Tap &quot;START RECORDING MY STORY&quot; above to add one.
        </p>
      ) : (
        <ul className="space-y-3">
          {stories.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border-2 border-gold/30 bg-white/5 p-4 flex items-center justify-between gap-4"
            >
              <span className="text-white truncate" style={{ fontSize: "22px" }}>{s.title}</span>
              <button
                type="button"
                onClick={() => playStory(s.id)}
                className="shrink-0 rounded-lg border-2 border-gold bg-gold px-4 py-2 text-navy font-semibold hover:bg-gold/90"
                style={{ fontSize: "20px" }}
              >
                {loadingId === s.id ? <Loader2 className="h-6 w-6 animate-spin" /> : playingId === s.id ? "Pause" : "Play"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
