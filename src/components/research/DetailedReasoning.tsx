import { Card } from "@/components/ui/Card";
import type { InvestmentDecision } from "@/types/research";

interface DetailedReasoningProps {
  reasoning: InvestmentDecision["reasoning"];
}

export function DetailedReasoning({ reasoning }: DetailedReasoningProps) {
  return (
    <Card
      title="Detailed Reasoning"
      subtitle="Key factors behind the investment decision"
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      }
    >
      <ol className="space-y-3">
        {reasoning.map((point, index) => (
          <li
            key={`${point}-${index}`}
            className="flex gap-3 rounded-lg bg-slate-800/40 px-4 py-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed text-slate-300">{point}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
