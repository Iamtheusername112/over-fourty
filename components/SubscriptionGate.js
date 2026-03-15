"use client";

import Link from "next/link";

const PAID_TIERS = ["ACCESS", "FAMILY_SHIELD", "ELDER_ADVOCACY"];

export function SubscriptionGate({ subscriptionTier = "FREE", subscriptionStatus, children, className = "" }) {
  const isPaid = PAID_TIERS.includes(subscriptionTier) || subscriptionStatus === "active";

  if (isPaid) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="select-none blur-sm pointer-events-none [&>*]:pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-navy/80 p-6 text-center">
        <p className="font-serif text-lg font-semibold text-white sm:text-xl">
          Upgrade to the Family Shield to unlock your family&apos;s data.
        </p>
        <Link
          href="/billing"
          className="mt-4 rounded border-2 border-gold bg-gold px-6 py-3 font-semibold text-navy transition hover:bg-gold/90"
        >
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}
