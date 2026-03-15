import Link from "next/link";
import { Heart, Shield, Home, Pill, ArrowLeft } from "lucide-react";

const BENEFITS = [
  {
    id: "medicare",
    title: "Medicare",
    description: "Health coverage for people 65 and older. Check eligibility, sign up, or change plans.",
    href: "https://www.medicare.gov",
    icon: Shield,
  },
  {
    id: "social-security",
    title: "Social Security",
    description: "Retirement and disability benefits. Apply, check status, or get a replacement card.",
    href: "https://www.ssa.gov",
    icon: Heart,
  },
  {
    id: "housing",
    title: "Housing assistance",
    description: "Rental help, senior housing, and home repair programs in your area.",
    href: "https://www.hud.gov",
    icon: Home,
  },
  {
    id: "prescriptions",
    title: "Prescription help",
    description: "Programs to lower medication costs, including Medicare Part D and patient assistance.",
    href: "https://www.medicare.gov/drug-coverage-part-d",
    icon: Pill,
  },
];

export default function ElderBenefitsPage() {
  return (
    <div className="min-h-screen bg-navy">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/dashboard/elder"
            className="flex items-center gap-2 rounded-lg border-2 border-gold bg-transparent px-5 py-3 font-semibold text-gold hover:bg-gold/10"
            style={{ minHeight: "48px", fontSize: "22px" }}
          >
            <ArrowLeft className="h-6 w-6" aria-hidden />
            Back
          </Link>
          <h1 className="font-serif font-bold text-white" style={{ fontSize: "24px" }}>
            Benefits & programs
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 rounded-xl border-2 border-gold/30 bg-white/5 p-6">
          <h2 className="font-serif font-bold text-white mb-2" style={{ fontSize: "24px" }}>
            Get benefits with our help
          </h2>
          <p className="text-white/90" style={{ fontSize: "22px" }}>
            Use the links below to reach official government and community programs. We’ve gathered the main ones so you can find what you need quickly.
          </p>
        </div>

        <ul className="space-y-6">
          {BENEFITS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border-2 border-gold bg-gold/10 p-6 transition hover:bg-gold/20 hover:border-gold"
                >
                  <div className="flex items-start gap-4">
                    <span className="rounded-lg bg-gold/20 p-3 text-gold">
                      <Icon className="h-8 w-8" aria-hidden />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-white mb-2" style={{ fontSize: "22px" }}>
                        {item.title}
                      </h3>
                      <p className="text-white/90 mb-4" style={{ fontSize: "20px" }}>
                        {item.description}
                      </p>
                      <span className="inline-block rounded-lg border-2 border-gold bg-gold px-4 py-2 font-semibold text-navy hover:bg-gold/90" style={{ fontSize: "20px" }}>
                        Go to program →
                      </span>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-white/70" style={{ fontSize: "20px" }}>
          Need one-on-one help applying? Your family can upgrade to our Elder Advocacy tier for personalized support.
        </p>
      </main>
    </div>
  );
}
