"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, ThumbsUp, Loader2 } from "lucide-react";
import { elderCheckIn } from "@/app/actions/profile";
import { createLegacyStory, getLegacyStoryPlaybackUrl } from "@/app/actions/legacy";

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
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setUploading(true);
        const form = new FormData();
        form.append("audio", blob);
        form.append("title", "My Story");
        const result = await createLegacyStory(form);
        setUploading(false);
        setRecording(false);
        if (result?.ok) {
          setRecordError("");
          router.refresh();
        } else {
          setRecordError(result?.error || "Upload failed.");
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
