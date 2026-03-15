import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/#the-audit", label: "The Audit" },
  { href: "/#the-vault", label: "The Vault" },
  { href: "/#the-audit", label: "For Families" },
  { href: "/billing", label: "Pricing" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Aegis"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div>
                <span className="block font-serif font-semibold text-white">
                  AEGIS FAMILY COMMAND CENTER
                </span>
                <span className="block text-xs text-gold">
                  OPTIMIZE. PROTECT. PRESERVE.
                </span>
              </div>
            </Link>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/90 hover:text-gold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gold">
              Client Portal
            </h3>
            <Link href="/login" className="text-sm text-white/90 hover:text-gold">
              Member Login
            </Link>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
              Contact Info
            </h3>
            <p className="text-sm text-white/90">
              202 Damanyentea con
              <br />
              F: (303) 535-6860
            </p>
            <div className="mt-3 flex gap-3">
              <a href="#" className="text-white/80 hover:text-gold" aria-label="Facebook">
                <span className="text-lg">f</span>
              </a>
              <a href="#" className="text-white/80 hover:text-gold" aria-label="Instagram">
                <span className="text-lg">📷</span>
              </a>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/70">
          © The Aegis Family Command Center
        </p>
      </div>
    </footer>
  );
}
