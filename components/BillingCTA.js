"use client";

import { useState } from "react";
import Link from "next/link";

export function BillingCTA({ tier, cta, ctaStyle, href = "#" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFamilyShield() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "FAMILY_SHIELD" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL received.");
    } catch (e) {
      setError("Request failed.");
    }
    setLoading(false);
  }

  if (tier === "FAMILY SHIELD") {
    return (
      <div className="mt-8">
        <button
          type="button"
          onClick={handleFamilyShield}
          disabled={loading}
          className={`w-full rounded py-3 text-center font-semibold uppercase tracking-wide transition ${ctaStyle} disabled:opacity-70`}
        >
          {loading ? "Redirecting…" : cta}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`mt-8 block rounded py-3 text-center font-semibold uppercase tracking-wide transition ${ctaStyle}`}
    >
      {cta}
    </Link>
  );
}
