"use client";

import { useState } from "react";
import { Mic, ThumbsUp } from "lucide-react";
import { elderCheckIn } from "@/app/actions/profile";

export function ElderActions() {
  const [checkInStatus, setCheckInStatus] = useState("");
  const [recording, setRecording] = useState(false);

  async function handleCheckIn() {
    setCheckInStatus("…");
    const result = await elderCheckIn();
    setCheckInStatus(result.ok ? "Thank you. We’ve recorded that you’re okay." : (result.error || "Try again."));
  }

  function handleRecordStory() {
    setRecording(true);
    // Placeholder: in production, open recorder or use MediaRecorder API
    setTimeout(() => setRecording(false), 1000);
  }

  return (
    <div className="space-y-6">
      {/* Record My Story - massive gold button */}
      <button
        type="button"
        onClick={handleRecordStory}
        disabled={recording}
        className="w-full rounded-xl border-2 border-gold bg-gold py-6 text-navy shadow-lg transition hover:bg-gold/90 disabled:opacity-70"
        style={{ fontSize: "24px", minHeight: "80px", fontWeight: 700 }}
      >
        <span className="flex items-center justify-center gap-3">
          <Mic className="h-8 w-8" aria-hidden />
          {recording ? "Recording…" : "Record My Story"}
        </span>
      </button>

      {/* Daily Check-in */}
      <div className="rounded-xl border-2 border-white/20 bg-white/5 p-6">
        <h2 className="font-serif text-xl font-bold text-white mb-4" style={{ fontSize: "24px" }}>
          Daily Check-in
        </h2>
        <button
          type="button"
          onClick={handleCheckIn}
          className="w-full rounded-xl border-2 border-gold bg-white/10 py-4 font-semibold text-white hover:bg-white/20"
          style={{ fontSize: "24px", minHeight: "56px" }}
        >
          <span className="flex items-center justify-center gap-2">
            <ThumbsUp className="h-7 w-7" aria-hidden />
            I am okay
          </span>
        </button>
        {checkInStatus && (
          <p className="mt-3 text-lg text-gold" style={{ fontSize: "20px" }}>
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
        <li className="rounded-xl border-2 border-white/10 bg-white/5 p-5 text-white/80" style={{ fontSize: "20px" }}>
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
