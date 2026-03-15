"use client";

import Link from "next/link";
import { Building2, Shield, Zap } from "lucide-react";

// Placeholder data for net worth projection (years 0-10, values in $M)
const currentPath = [0.8, 1.0, 1.1, 1.25, 1.35, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
const optimizedPath = [0.8, 1.0, 1.2, 1.5, 1.9, 2.4, 3.0, 3.7, 4.5, 5.4, 6.5];

function NetWorthChart() {
  const width = 400;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxVal = Math.max(...optimizedPath);
  const minVal = Math.min(...currentPath);

  const toX = (i) => padding.left + (i / (currentPath.length - 1)) * chartWidth;
  const toY = (v) => padding.top + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight;

  const currentPoints = currentPath.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const optimizedPoints = optimizedPath.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  return (
    <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
      <h3 className="font-serif text-lg font-semibold text-navy mb-4">Net Worth Projection</h3>
      <p className="text-sm text-navy/70 mb-4">10-year outlook ($M)</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <polyline
          fill="none"
          stroke="#0f172a"
          strokeOpacity="0.5"
          strokeWidth="2"
          points={currentPoints}
        />
        <polyline
          fill="none"
          stroke="#a89160"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          points={optimizedPoints}
        />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartHeight} stroke="currentColor" strokeWidth="1" className="text-navy/20" />
        <line x1={padding.left} y1={padding.top + chartHeight} x2={padding.left + chartWidth} y2={padding.top + chartHeight} stroke="currentColor" strokeWidth="1" className="text-navy/20" />
      </svg>
      <div className="flex gap-6 mt-3 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 bg-navy/40 rounded" /> Current path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 border border-gold border-dashed rounded" /> Optimized path
        </span>
      </div>
    </div>
  );
}

function WealthHealthScore() {
  const debtToIncome = 28;
  const retirementRate = 12;
  const intergenerationalCost = 8;
  const score = Math.round(100 - (debtToIncome * 0.4 + (20 - Math.min(retirementRate, 20)) * 0.35 + intergenerationalCost * 0.25));

  return (
    <div className="rounded-lg border border-gold/30 bg-white p-6 shadow-md">
      <h3 className="font-serif text-lg font-semibold text-navy mb-4">Wealth Health Score</h3>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-bold text-gold">{Math.max(0, Math.min(100, score))}</span>
        <span className="text-navy/70">/ 100</span>
      </div>
      <ul className="space-y-2 text-sm text-navy/80">
        <li className="flex justify-between">
          <span>Debt-to-Income ratio</span>
          <span className="font-medium">{debtToIncome}%</span>
        </li>
        <li className="flex justify-between">
          <span>Retirement savings rate</span>
          <span className="font-medium">{retirementRate}%</span>
        </li>
        <li className="flex justify-between">
          <span>Intergenerational cost (parent support)</span>
          <span className="font-medium">{intergenerationalCost}% of income</span>
        </li>
      </ul>
    </div>
  );
}

const STRATEGIC_ASSETS = [
  {
    id: "institutional",
    icon: Building2,
    title: "Institutional Yield",
    subtitle: "Real estate & private credit funds",
    description: "Low risk, high predictability. Steady cash flow and capital preservation for the 40+ investor.",
  },
  {
    id: "generational",
    icon: Shield,
    title: "Generational Transfer",
    subtitle: "Insurance & tax-efficient planning",
    description: "Protect your wealth from probate. Structures designed for smooth transfer to the next generation.",
  },
  {
    id: "growth",
    icon: Zap,
    title: "High-Growth Equities",
    subtitle: "Leveraged accumulation strategies",
    description: "Wealth acceleration without gambling. Disciplined, systematic exposure to long-term growth.",
  },
];

export default function WealthAccelerator() {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl font-bold text-navy mb-2">The Wealth Accelerator</h2>
      <p className="text-navy/80 mb-6 max-w-2xl">
        You don&apos;t need a miracle; you need a system. Stop chasing market luck and start building generational structure.
      </p>

      {/* Net Worth + Wealth Health Score */}
      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <NetWorthChart />
        <WealthHealthScore />
      </div>

      {/* Strategic Assets */}
      <div>
        <h3 className="font-serif text-xl font-semibold text-navy mb-4">Strategic Assets</h3>
        <p className="text-sm text-navy/70 mb-6">High-value financial pillars for the 40+ investor.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {STRATEGIC_ASSETS.map((asset) => {
            const Icon = asset.icon;
            return (
              <div
                key={asset.id}
                className="rounded-lg border border-gold/30 bg-white p-6 shadow-md flex flex-col"
              >
                <div className="flex items-center gap-2 text-gold mb-3">
                  <Icon className="h-6 w-6" />
                  <span className="font-serif font-semibold text-navy">{asset.title}</span>
                </div>
                <p className="text-xs text-gold/90 uppercase tracking-wider mb-2">{asset.subtitle}</p>
                <p className="text-sm text-navy/80 flex-1 mb-4">{asset.description}</p>
                <Link
                  href={`/dashboard/optimizer/wealth/${asset.id}`}
                  className="block w-full rounded border-2 border-gold bg-transparent py-2 text-sm font-semibold text-navy hover:bg-gold/10 transition text-center"
                >
                  Get More Info
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
