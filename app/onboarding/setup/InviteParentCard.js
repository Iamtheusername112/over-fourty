"use client";

import { useState } from "react";
import { Share2, MessageCircle, Smartphone } from "lucide-react";

export function InviteParentCard({ profile, onNext }) {
  const [copied, setCopied] = useState(false);
  const code = profile?.invite_code || "--------";
  const inviteMessage = `Join our family on Aegis. Use my invite code: ${code}\n\nhttps://aegis-family.com/join?code=${code}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
  const smsUrl = `sms:?body=${encodeURIComponent(inviteMessage)}`;

  function handleCopy() {
    if (typeof navigator !== "undefined" && code !== "--------") {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-lg border-2 border-gold bg-gradient-to-b from-navy to-navy/95 p-8 shadow-xl">
      <div className="text-center">
        <p className="font-serif text-gold text-sm uppercase tracking-widest">The Bridge</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-white">
          Invite your parent to join
        </h2>
        <p className="mt-2 text-white/80 text-sm">
          Share this code so they can link their account to your Family Shield subscription.
        </p>
      </div>

      <div className="mt-8 rounded-xl border-2 border-gold/50 bg-white/5 p-6 text-center">
        <p className="text-xs uppercase tracking-wider text-gold/90">Parent Invite Code</p>
        <p className="mt-2 font-mono text-3xl font-bold tracking-widest text-white">{code}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 inline-flex items-center gap-2 rounded border border-gold bg-gold/20 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/30"
        >
          <Share2 className="h-4 w-4" />
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-gold/50 bg-white/5 py-3 text-white transition hover:border-gold hover:bg-white/10"
        >
          <MessageCircle className="h-5 w-5 text-gold" />
          Share via WhatsApp
        </a>
        <a
          href={smsUrl}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-gold/50 bg-white/5 py-3 text-white transition hover:border-gold hover:bg-white/10"
        >
          <Smartphone className="h-5 w-5 text-gold" />
          Share via SMS
        </a>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-8 w-full rounded-lg border-2 border-gold bg-gold py-3 font-semibold text-navy hover:bg-gold/90"
      >
        Next
      </button>
    </div>
  );
}
