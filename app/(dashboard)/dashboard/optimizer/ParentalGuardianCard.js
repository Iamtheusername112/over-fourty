import Link from "next/link";
import { Shield } from "lucide-react";

export function ParentalGuardianCard({ elderStatus, latestStory, hasLinkedElder }) {
  if (!hasLinkedElder) {
    return (
      <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
        <div className="flex items-center gap-2 text-gold">
          <Shield className="h-6 w-6" />
          <span className="font-serif text-lg font-semibold text-navy">Parental Guardian</span>
        </div>
        <p className="mt-4 text-navy/80">No linked Elder yet. Link a parent in settings.</p>
      </div>
    );
  }
  const status = elderStatus?.last_seen
    ? new Date(elderStatus.last_seen).toLocaleDateString(undefined, { dateStyle: "short", timeStyle: "short" })
    : null;
  const isActive = status && (Date.now() - new Date(elderStatus.last_seen).getTime()) < 24 * 60 * 60 * 1000;

  return (
    <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
      <div className="flex items-center gap-2 text-gold">
        <Shield className="h-6 w-6" />
        <span className="font-serif text-lg font-semibold text-navy">Parental Guardian</span>
      </div>
      <div className="mt-4 space-y-3 text-navy">
        <p className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-medium">Current Safety Status:</span>
          <span>{isActive ? "Active" : "No recent check-in"}</span>
        </p>
        <p className="text-sm text-navy/80">
          Last check-in: {status ?? "—"}
        </p>
        <p className="text-sm text-navy/80">
          Last Legacy Recording: {latestStory?.title ?? "—"}
        </p>
        {latestStory?.id && (
          <Link
            href={`/dashboard/optimizer/story/${latestStory.id}`}
            className="inline-block rounded border border-gold bg-gold/10 px-4 py-2 text-sm font-semibold text-navy hover:bg-gold/20"
          >
            Listen Now
          </Link>
        )}
      </div>
    </div>
  );
}
