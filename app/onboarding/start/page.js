import { Suspense } from "react";
import OnboardingStartContent from "./OnboardingStartContent";

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <p className="text-white/80">Loading…</p>
    </div>
  );
}

export default function OnboardingStartPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <OnboardingStartContent />
    </Suspense>
  );
}
