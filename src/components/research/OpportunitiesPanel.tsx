import { Card } from "@/components/ui/Card";
import type { InvestmentDecision } from "@/types/research";

interface OpportunitiesPanelProps {
  opportunities: InvestmentDecision["opportunities"];
}

export function OpportunitiesPanel({ opportunities }: OpportunitiesPanelProps) {
  return (
    <Card
      title="Opportunities"
      subtitle="Upside catalysts and growth potential"
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      }
    >
      <ul className="space-y-3">
        {opportunities.map((opportunity, index) => (
          <li
            key={`${opportunity}-${index}`}
            className="flex gap-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-4 py-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed text-slate-300">{opportunity}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
