"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  User,
  Shield,
  Fingerprint,
  Mic,
  Lock,
} from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { AuditModal } from "@/components/AuditModal";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.5 },
};

export default function Home() {
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-[70vh] overflow-hidden bg-bg-off-white">
          <div className="absolute inset-0">
            <Image
              src="/assets/hero-banner.png"
              alt="Multi-generational family"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-navy/40" />
          </div>
          <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="font-serif text-3xl font-bold leading-tight text-gold sm:text-4xl md:text-5xl">
                RECLAIM YOUR VITALITY. SECURE THEIR INDEPENDENCE.
              </h1>
              <p className="mt-4 text-lg text-white drop-shadow-md sm:text-xl">
                A Single, Powerful Platform for All Generations.
              </p>
              <button
                onClick={() => setAuditModalOpen(true)}
                className="mt-8 inline-block rounded border-[1px] border-gold bg-navy px-6 py-3 font-semibold uppercase tracking-wide text-white transition hover:bg-navy/90"
              >
                START YOUR FAMILY AUDIT
              </button>
            </motion.div>
          </div>
        </section>

        {/* Agitation */}
        <section id="the-audit" className="bg-bg-off-white py-20" aria-label="Stop sliding stop worrying">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...fadeInUp}
              className="font-serif text-3xl font-bold text-navy sm:text-4xl"
            >
              STOP SLIDING. STOP WORRYING.
            </motion.h2>
            <motion.p
              {...fadeInUp}
              className="mt-2 text-navy/90"
            >
              The Intergenerational Crisis We Solve.
            </motion.p>
            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
              <motion.div {...fadeInUp} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-navy">For You 40-60</h3>
                <div className="mt-3 flex items-center gap-2 text-gold">
                  <TrendingUp className="h-5 w-5" />
                  <User className="h-5 w-5" />
                </div>
                <p className="mt-3 text-navy/90">
                  The Bio-Age Trap: How optimization data prevents burnout.
                </p>
              </motion.div>
              <motion.div {...fadeInUp} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-navy">For Them 80+</h3>
                <div className="mt-3 flex items-center gap-2 text-gold">
                  <Shield className="h-5 w-5" />
                  <User className="h-5 w-5" />
                </div>
                <p className="mt-3 text-navy/90">
                  The Dignity Shield: How non-invasive tracking secures independence.
                </p>
              </motion.div>
            </div>
            <div className="mt-8 border-t border-gold/40 pt-8" />
          </div>
        </section>

        {/* Pillars */}
        <section id="the-vault" className="bg-bg-off-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...fadeInUp}
              className="font-serif text-3xl font-bold text-navy sm:text-4xl"
            >
              THE THREE AEGIS PILLARS
            </motion.h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <motion.div
                {...fadeInUp}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg hover:border hover:border-gold"
              >
                <div className="text-gold">
                  <Fingerprint className="h-10 w-10" />
                </div>
                <h3 className="mt-4 font-semibold uppercase tracking-wide text-navy">
                  Vitality Audit
                </h3>
                <p className="mt-2 text-navy/90">
                  Biometrics data e-vitality.
                </p>
              </motion.div>
              <motion.div
                {...fadeInUp}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg hover:border hover:border-gold"
              >
                <div className="text-gold">
                  <Mic className="h-10 w-10" />
                </div>
                <h3 className="mt-4 font-semibold uppercase tracking-wide text-navy">
                  Legacy Vault
                </h3>
                <p className="mt-2 text-navy/90">
                  Audio wave all recording rece.
                </p>
              </motion.div>
              <motion.div
                {...fadeInUp}
                className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg hover:border hover:border-gold"
              >
                <div className="text-gold">
                  <Lock className="h-10 w-10" />
                </div>
                <h3 className="mt-4 font-semibold uppercase tracking-wide text-navy">
                  Guardian Alert
                </h3>
                <p className="mt-2 text-navy/90">
                  A secure lock notifications.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AuditModal isOpen={auditModalOpen} onClose={() => setAuditModalOpen(false)} />
    </div>
  );
}
