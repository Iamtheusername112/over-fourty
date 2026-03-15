"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/#the-audit", label: "The Audit" },
  { href: "/#the-vault", label: "The Vault" },
  { href: "/billing", label: "Pricing" },
];

export function NavBar({ currentPage = "landing" }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy/20 bg-navy">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
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
        <div className="flex items-center gap-6">
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
      </nav>
    </header>
  );
}
