"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function handleMagicLink(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage({ type: "", text: "" });
    const supabase = createClient();
    if (!supabase) {
      setMessage({ type: "error", text: "Auth not configured." });
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: "Check your email for the magic link." });
  }

  async function handleGoogle() {
    setLoading(true);
    setMessage({ type: "", text: "" });
    const supabase = createClient();
    if (!supabase) {
      setMessage({ type: "error", text: "Auth not configured." });
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    });
    setLoading(false);
    if (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-navy">
      <header className="border-b border-white/10 py-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Aegis" width={40} height={40} className="object-contain" />
          <span className="font-serif font-semibold text-white">AEGIS</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border-2 border-gold bg-navy/95 p-8 shadow-xl">
          <h1 className="font-serif text-2xl font-bold text-white text-center">Member Login</h1>
          <p className="mt-2 text-center text-white/80 text-sm">Sign in with email or Google.</p>

          <form onSubmit={handleMagicLink} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-white/90">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="mt-1 w-full rounded border border-gold/50 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded border border-gold bg-gold py-3 font-semibold text-navy transition hover:bg-gold/90 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send Magic Link"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-xs text-white/60">or</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded border border-white/30 bg-white/5 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Continue with Google
          </button>

          {message.text && (
            <p
              className={`mt-4 text-center text-sm ${
                message.type === "error" ? "text-red-400" : "text-gold"
              }`}
            >
              {message.text}
            </p>
          )}

          <p className="mt-6 text-center text-xs text-white/50">
            <Link href="/" className="underline hover:text-gold">Back to Home</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
