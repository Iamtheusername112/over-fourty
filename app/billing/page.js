"use client";

import { motion } from "framer-motion";
import { User, Users, UserCircle, Check, Lock, RefreshCw, Shield } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: 0.5 },
};

const tiers = [
  {
    name: "ACCESS",
    price: "$97",
    period: "/mo",
    subtitle: "Individual",
    icon: User,
    features: [
      "Legacy Vault (Audio stories)",
      "Basic Wellness Check",
      "Family Hub Access",
      "Annual Review",
    ],
    cta: "START ACCESS",
    ctaStyle: "bg-navy text-white hover:bg-navy/90",
    featured: false,
  },
  {
    name: "FAMILY SHIELD",
    price: "$497",
    period: "/mo",
    subtitle: "THE CORE GENERATIONAL SOLUTION.",
    icon: Users,
    features: [
      "Everything in Access",
      "Guardian Alerts (24/7 Security)",
      "Hormone & Bio-Data Audit (For You)",
      "Quarterly Strategy Calls",
      "Concierge Legacy Support",
    ],
    cta: "GET THE FAMILY SHIELD",
    ctaStyle: "bg-gold text-navy hover:bg-gold/90",
    featured: true,
  },
  {
    name: "ELDER ADVOCACY",
    price: "$1,500",
    period: "/mo",
    subtitle: "High-Touch, Concierge Support.",
    icon: UserCircle,
    features: [
      "Everything in Family Shield",
      "Dedicated Case Manager",
      "Estate & Legal Coordination",
      "Full Heritage Biography (Video)",
      "Medication & Doctor Sync",
    ],
    cta: "CONTACT ADVOCATE",
    ctaStyle: "bg-navy text-white hover:bg-navy/90",
    featured: false,
  },
];

const trustItems = [
  { icon: Lock, label: "Secure Payment (PCI Compliant)" },
  { icon: RefreshCw, label: "Cancel Anytime" },
  { icon: Shield, label: "Guaranteed Dignity" },
];

export default function BillingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar currentPage="billing" />
      <main className="flex-1 bg-bg-off-white">
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h1
              {...fadeInUp}
              className="font-serif text-3xl font-bold text-navy sm:text-4xl md:text-5xl text-center"
            >
              SELECT YOUR FAMILY&apos;S SECURE FUTURE.
            </motion.h1>
            <motion.p
              {...fadeInUp}
              className="mt-4 text-center text-navy/80"
            >
              Customize your protection and optimization path.
            </motion.p>

            <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8 items-stretch">
              {tiers.map((tier, i) => {
                const Icon = tier.icon;
                return (
                  <motion.div
                    key={tier.name}
                    {...fadeInUp}
                    className={`relative flex flex-col rounded-lg bg-white p-6 shadow-md ${
                      tier.featured
                        ? "md:scale-105 ring-2 ring-gold/50 shadow-gold/20 shadow-xl"
                        : ""
                    }`}
                    style={
                      tier.featured
                        ? {
                            boxShadow: "0 25px 50px -12px rgba(168, 145, 96, 0.25)",
                          }
                        : undefined
                    }
                  >
                    <div className="flex justify-center text-gold">
                      <Icon className="h-12 w-12" />
                    </div>
                    <h2 className="mt-4 text-center font-semibold uppercase tracking-wide text-navy">
                      {tier.name}
                    </h2>
                    <div
                      className={`mt-2 text-center text-3xl font-bold ${
                        tier.featured ? "text-navy" : "text-gold"
                      }`}
                    >
                      {tier.price}
                      <span className="text-lg font-normal text-navy/80">{tier.period}</span>
                    </div>
                    <p className="mt-1 text-center text-sm text-navy/80">
                      {tier.subtitle}
                    </p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-navy/90">
                          <Check className="h-5 w-5 shrink-0 text-gold" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="#"
                      className={`mt-8 block rounded py-3 text-center font-semibold uppercase tracking-wide transition ${tier.ctaStyle}`}
                    >
                      {tier.cta}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Band */}
            <motion.div
              {...fadeInUp}
              className="mt-20 rounded-lg bg-navy py-12 px-6"
            >
              <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
                {trustItems.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 text-white"
                  >
                    <Icon className="h-8 w-8 text-gold" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
