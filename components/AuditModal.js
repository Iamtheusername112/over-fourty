"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { submitLead } from "@/app/actions/leads";

export function AuditModal({ isOpen, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const formData = new FormData(e.target);
    const result = await submitLead(formData);
    if (result.ok) {
      setStatus("success");
      setMessage("Thank you. We'll be in touch soon.");
      e.target.reset();
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong.");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div
        className="w-full max-w-md rounded-lg bg-bg-off-white p-6 shadow-xl border border-gold"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            id="audit-modal-title"
            className="font-serif text-xl text-navy"
          >
            Start Your Family Audit
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-navy hover:bg-navy/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {status === "success" ? (
          <p className="text-navy">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="audit-name" className="mb-1 block text-sm font-medium text-navy">
                Name
              </label>
              <input
                id="audit-name"
                name="name"
                type="text"
                required
                disabled={status === "loading"}
                className="w-full rounded border border-navy/30 bg-white px-3 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="audit-email" className="mb-1 block text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="audit-email"
                name="email"
                type="email"
                required
                disabled={status === "loading"}
                className="w-full rounded border border-navy/30 bg-white px-3 py-2 text-navy focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                placeholder="you@example.com"
              />
            </div>
            {message && (
              <p className={`text-sm ${status === "error" ? "text-red-600" : "text-navy"}`}>
                {message}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 rounded bg-navy px-4 py-2 font-medium text-white border border-gold hover:bg-navy/90 disabled:opacity-50"
              >
                {status === "loading" ? "Sending…" : "Submit"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-navy/30 px-4 py-2 font-medium text-navy hover:bg-navy/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
