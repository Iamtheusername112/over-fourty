"use client";

import { SignOutButton } from "@clerk/nextjs";

export function DashboardSignOut({ variant = "optimizer" }) {
  const isElder = variant === "elder";
  return (
    <SignOutButton>
      <button
        type="button"
        className={
          isElder
            ? "rounded-lg border-2 border-white/40 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20 transition"
            : "rounded border border-white/40 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
        }
        style={isElder ? { minHeight: "48px", fontSize: "20px" } : undefined}
      >
        Sign out
      </button>
    </SignOutButton>
  );
}
