"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    size: 6 + Math.random() * 6,
    color: ["#a89160", "#d4af37", "#f8f9fa", "#0f172a"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm opacity-80"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `confetti-fall 2.5s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

export default function OnboardingStartContent({ isPaymentSuccess = false }) {
  const [showContent, setShowContent] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy">
      {hasMounted && isPaymentSuccess && <Confetti />}
      {/* Gold shimmer / celebration overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10 animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-0 opacity-40 animate-shimmer-gold" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.95 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl text-center"
        >
          <p className="font-serif text-gold text-lg tracking-wide uppercase">Welcome to the Shield</p>
          <h1 className="mt-4 font-serif text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Your family&apos;s future is now secure.
          </h1>
          <p className="mt-6 text-white/80">
            Complete a few quick steps to personalize your Command Center and connect your family.
          </p>
          <Link
            href="/onboarding/setup"
            className="mt-10 inline-block rounded border-2 border-gold bg-gold px-8 py-4 font-semibold text-navy transition hover:bg-gold/90"
          >
            Next
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
