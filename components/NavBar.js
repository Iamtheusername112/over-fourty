"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#the-audit", label: "The Audit" },
  { href: "/#the-vault", label: "The Vault" },
  { href: "/billing", label: "Pricing" },
];

export function NavBar({ currentPage = "landing" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy/20 bg-navy">
      <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/logo.png"
              alt="Aegis Family Command Center"
              width={48}
              height={48}
              className="h-10 w-10 object-contain sm:h-12 sm:w-12"
            />
            <div className="hidden sm:block">
              <span className="block font-serif text-lg font-semibold leading-tight text-white">
                AEGIS FAMILY COMMAND CENTER
              </span>
              <span className="block text-xs uppercase tracking-wider text-gold">
                OPTIMIZE. PROTECT. PRESERVE.
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map(({ href, label }) => {
              const isBilling = currentPage === "billing" && href === "/billing";
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors ${
                    isBilling ? "bg-gold/20 text-gold px-3 py-1.5 rounded" : "text-white hover:text-gold"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/login"
              className="rounded bg-gold px-4 py-2 text-sm font-semibold text-navy hover:bg-gold/90 transition-colors"
            >
              MEMBER LOGIN
            </Link>
          </div>

          {/* Mobile: right side = Member Login + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="rounded bg-gold px-3 py-2 text-xs font-semibold text-navy hover:bg-gold/90 transition-colors"
            >
              LOGIN
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-white/10 pt-4 pb-2 md:hidden">
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ href, label }) => {
                const isBilling = currentPage === "billing" && href === "/billing";
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        isBilling
                          ? "bg-gold/20 text-gold"
                          : "text-white hover:bg-white/10 hover:text-gold"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
