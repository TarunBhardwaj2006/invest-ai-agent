import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getRiskVariant, getSeverityVariant } from "@/lib/utils/research-ui";
import type { RiskAssessmentAnalysis } from "@/types/research";

interface RisksPanelProps {
  riskAssessment: RiskAssessmentAnalysis;
  decisionRisks: string[];
}

export function RisksPanel({ riskAssessment, decisionRisks }: RisksPanelProps) {
  return (
    <Card
      title="Risks"
      subtitle={`Risk level: ${riskAssessment.overallRiskLevel} (${riskAssessment.riskScore}/100)`}
      icon={
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
    >
      <div className="mb-4">
        <Badge variant={getRiskVariant(riskAssessment.overallRiskLevel)}>
          {riskAssessment.overallRiskLevel} risk
        </Badge>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-400">
        {riskAssessment.summary}
      </p>

      <div className="mb-5 space-y-2">
        <h4 className="text-sm font-medium text-slate-400">Identified Risks</h4>
        {riskAssessment.risks.map((risk, index) => (
          <div
            key={`${risk.category}-${index}`}
            className="rounded-lg border border-red-500/10 bg-red-500/5 px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-200">{risk.category}</span>
              <Badge variant={getSeverityVariant(risk.severity)}>{risk.severity}</Badge>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {risk.description}
            </p>
          </div>
        ))}
      </div>

      {riskAssessment.mitigatingFactors.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-2 text-sm font-medium text-slate-400">Mitigating Factors</h4>
          <ul className="space-y-1">
            {riskAssessment.mitigatingFactors.map((factor) => (
              <li key={factor} className="flex gap-2 text-sm text-slate-400">
                <span className="text-emerald-500">•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-sm font-medium text-slate-400">Key Investment Risks</h4>
        <ul className="space-y-2">
          {decisionRisks.map((risk, index) => (
            <li
              key={`decision-risk-${index}`}
              className="flex gap-2 rounded-lg bg-slate-800/40 px-3 py-2 text-sm text-slate-300"
            >
              <span className="text-red-400">!</span>
              {risk}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
