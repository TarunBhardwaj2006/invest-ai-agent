import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { FinancialHealthAnalysis } from "@/types/research";

interface FinancialHealthPanelProps {
  data: FinancialHealthAnalysis;
}

function trendVariant(trend: string): "success" | "warning" | "danger" {
  if (trend === "growing") return "success";
  if (trend === "declining") return "danger";
  return "warning";
}

function debtVariant(level: string): "success" | "warning" | "danger" {
  if (level === "low") return "success";
  if (level === "high") return "danger";
  return "warning";
}

export function FinancialHealthPanel({ data }: FinancialHealthPanelProps) {
  return (
    <Card
      title="Financial Health"
      subtitle={`Overall score: ${data.overallHealthScore}/100`}
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant={trendVariant(data.revenueTrend)}>
          Revenue: {data.revenueTrend}
        </Badge>
        <Badge variant={debtVariant(data.debtLevel)}>
          Debt: {data.debtLevel}
        </Badge>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Profitability" value={data.profitability} />
        <InfoBlock label="Cash Flow" value={data.cashFlow} />
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-400">{data.summary}</p>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-400">Key Metrics</h4>
        {data.keyMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-slate-700/50 bg-slate-800/40 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-200">{metric.label}</span>
              <span className="text-sm text-blue-400">{metric.value}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{metric.assessment}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-300">{value}</p>
    </div>
  );
}
