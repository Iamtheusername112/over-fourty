"use client";

import Link from "next/link";
import { Building2, Shield, Zap } from "lucide-react";

const ASSET_ICONS = { institutional: Building2, generational: Shield, growth: Zap };

const GUIDE_CONTENT = {
  institutional: {
    needToKnow: [
      "Institutional yield focuses on real estate and private credit: steady cash flow with lower volatility than public equities.",
      "Target 6–10% annual yield with capital preservation. Ideal for the 40+ investor who prioritizes predictability.",
      "Diversify across property types (multifamily, industrial, healthcare) and private credit (senior secured loans).",
      "Liquidity is typically lower than public markets; use only capital you won’t need for 3–5+ years.",
    ],
    howToGetReach: [
      "Allocate 15–25% of your investable portfolio to institutional yield to smooth returns and fund lifestyle or reinvestment.",
      "Use quarterly distributions to reinvest in growth assets or cover intergenerational costs without selling principal.",
      "Partner with vetted fund managers or platforms that offer institutional-style access (minimums often $25k–$100k).",
      "Track yield vs. inflation: aim for real (after-inflation) returns of 4%+ to build long-term reach.",
    ],
  },
  generational: {
    needToKnow: [
      "Generational transfer is about moving wealth to the next generation with minimal tax and probate friction.",
      "Key tools: trusts (revocable/irrevocable), life insurance, beneficiary designations, and gifting strategies.",
      "Estate and gift tax exemptions change; structure plans with flexibility and regular review.",
      "Insurance (life, long-term care) protects the family from catastrophic drawdowns and can be used in transfer planning.",
    ],
    howToGetReach: [
      "Get a baseline: inventory all accounts, properties, and policies with beneficiaries and titling. Fix gaps (no beneficiary, wrong titling).",
      "Use annual gifting and trust funding to shift growth out of your estate and into the next generation’s timeline.",
      "Align insurance death benefit and LTC coverage with your transfer goals so family wealth isn’t eroded by care costs.",
      "Schedule an estate plan review every 3–5 years or after major life or tax law changes.",
    ],
  },
  growth: {
    needToKnow: [
      "High-growth equities are for long-term accumulation: diversified, disciplined exposure without stock-picking or market timing.",
      "Use low-cost index or factor funds; avoid concentration and leverage that could blow up your plan.",
      "Time horizon matters: 10+ years allows you to ride volatility; under 5 years, reduce equity and add yield.",
      "Rebalance periodically (e.g. annually) to keep target allocation and avoid drift into excessive risk.",
    ],
    howToGetReach: [
      "Target 40–60% of investable assets in growth (depending on age and risk tolerance) with the rest in yield and reserves.",
      "Reinvest dividends and stay invested through downturns; selling in drawdowns locks in losses and hurts long-term reach.",
      "Use tax-advantaged accounts (401k, IRA, HSA) for growth first to maximize compounding and tax efficiency.",
      "Measure success by real wealth growth over 10+ years, not short-term performance.",
    ],
  },
};

export function AssetGuideContent({ assetId, title, subtitle }) {
  const content = GUIDE_CONTENT[assetId] || { needToKnow: [], howToGetReach: [] };
  const Icon = ASSET_ICONS[assetId];

  return (
    <article className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-gold mb-1">
          {Icon && <Icon className="h-6 w-6" />}
          <span className="font-serif text-sm font-semibold uppercase tracking-wider">{subtitle}</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-navy">{title}</h1>
      </div>

      <section className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
        <h2 className="font-serif text-xl font-semibold text-navy mb-4">What you need to know</h2>
        <ul className="space-y-3 text-navy/90">
          {content.needToKnow.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
        <h2 className="font-serif text-xl font-semibold text-navy mb-4">How to get reach from it</h2>
        <ul className="space-y-3 text-navy/90">
          {content.howToGetReach.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-navy/70">
        This guide is part of your Wealth Accelerator access. For personalized allocation and advisor support, explore our{" "}
        <Link href="/billing" className="text-gold font-medium hover:underline">
          Elder Advocacy
        </Link>{" "}
        tier.
      </p>
      <p className="mt-4 text-sm text-navy/70">
        Ready to apply for loans or government funds?{" "}
        <Link href="/dashboard/optimizer/kyc" className="text-gold font-medium hover:underline">
          Get very easy with our help
        </Link>{" "}
        — complete KYC and we’ll guide you to the right programs and institutions.
      </p>
    </article>
  );
}
